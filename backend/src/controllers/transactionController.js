import { validationResult } from "express-validator";
import Book from "../models/Book.js";
import Transaction from "../models/Transaction.js";
import { addDays, diffDays, startOfDay } from "../utils/date.js";

const finePerDay = () => {
  const n = Number(process.env.FINE_PER_DAY ?? 10);
  return Number.isFinite(n) ? n : 10;
};

export const checkAvailability = async (req, res) => {
  const { name, author } = req.query;
  if (!name && !author) {
    return res.status(400).json({ message: "At least one of name/author is required" });
  }

  const filter = {};
  if (name) filter.name = name;
  if (author) filter.author = author;

  const books = await Book.find(filter).sort({ name: 1, author: 1 });
  const result = books.map((b) => ({
    _id: b._id,
    name: b.name,
    author: b.author,
    serialNumber: b.serialNumber,
    availability: b.status === "available" && b.quantity > 0 ? "Available" : "Not Available",
    status: b.status,
    type: b.type,
  }));
  res.json(result);
};

export const issueBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { bookId, issueDate, returnDate, remarks } = req.body;

  const book = await Book.findById(bookId);
  if (!book) return res.status(404).json({ message: "Book not found" });

  if (book.status !== "available" || book.quantity < 1) {
    return res.status(400).json({ message: "Book is not available" });
  }

  const issue = new Date(issueDate);
  const ret = new Date(returnDate);
  const today = startOfDay(new Date());
  if (startOfDay(issue) > today) return res.status(400).json({ message: "Issue date cannot be future" });

  const maxReturn = addDays(issue, 15);
  if (startOfDay(ret) > startOfDay(maxReturn)) {
    return res.status(400).json({ message: "Return date cannot exceed 15 days" });
  }

  const tx = await Transaction.create({
    userId: req.user._id,
    bookId: book._id,
    issueDate: issue,
    returnDate: ret,
    actualReturnDate: null,
    fine: 0,
    finePaid: false,
    status: "issued",
    remarks,
  });

  // update inventory/status
  book.quantity -= 1;
  if (book.quantity <= 0) book.status = "issued";
  await book.save();

  res.status(201).json(await tx.populate("bookId", "name author serialNumber type"));
};

export const requestIssue = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { bookId, issueDate, returnDate } = req.body;

  const book = await Book.findById(bookId);
  if (!book) return res.status(404).json({ message: "Book not found" });

  const issue = new Date(issueDate);
  const ret = new Date(returnDate);
  const today = startOfDay(new Date());
  if (startOfDay(issue) > today) return res.status(400).json({ message: "Issue date cannot be future" });
  const maxReturn = addDays(issue, 15);
  if (startOfDay(ret) > startOfDay(maxReturn)) {
    return res.status(400).json({ message: "Return date cannot exceed 15 days" });
  }

  const tx = await Transaction.create({
    userId: req.user._id,
    bookId: book._id,
    issueDate: issue,
    returnDate: ret,
    status: "pending_issue",
  });

  res.status(201).json(await tx.populate("bookId", "name author serialNumber type"));
};

export const approveIssueRequest = async (req, res) => {
  const tx = await Transaction.findById(req.params.id);
  if (!tx) return res.status(404).json({ message: "Transaction not found" });
  if (tx.status !== "pending_issue") return res.status(400).json({ message: "Not a pending request" });

  const book = await Book.findById(tx.bookId);
  if (!book) return res.status(404).json({ message: "Book not found" });
  if (book.status !== "available" || book.quantity < 1) {
    return res.status(400).json({ message: "Book is not available" });
  }

  tx.status = "issued";
  await tx.save();

  book.quantity -= 1;
  if (book.quantity <= 0) book.status = "issued";
  await book.save();

  res.json(await tx.populate("bookId", "name author serialNumber type"));
};

export const returnBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { transactionId, actualReturnDate } = req.body;

  const tx = await Transaction.findById(transactionId).populate("bookId");
  if (!tx) return res.status(404).json({ message: "Transaction not found" });
  if (tx.status !== "issued" && tx.status !== "overdue") {
    return res.status(400).json({ message: "Transaction not in issued state" });
  }

  // Admin can return any; user can return own
  if (req.user.role !== "admin" && String(tx.userId) !== String(req.user._id)) {
    return res.status(403).json({ message: "Not allowed" });
  }

  const actual = actualReturnDate ? new Date(actualReturnDate) : new Date();
  tx.actualReturnDate = actual;

  const lateDays = Math.max(0, diffDays(actual, tx.returnDate));
  tx.fine = lateDays * finePerDay();
  tx.status = lateDays > 0 ? "overdue" : "returned";

  await tx.save();

  // restore inventory
  const book = tx.bookId;
  book.quantity += 1;
  book.status = "available";
  await book.save();

  res.json(await tx.populate("bookId", "name author serialNumber type"));
};

export const payFine = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { transactionId, finePaid, remarks } = req.body;
  const tx = await Transaction.findById(transactionId).populate("bookId", "name author serialNumber type");
  if (!tx) return res.status(404).json({ message: "Transaction not found" });

  if (req.user.role !== "admin" && String(tx.userId) !== String(req.user._id)) {
    return res.status(403).json({ message: "Not allowed" });
  }

  if (tx.fine > 0 && finePaid !== true) {
    return res.status(400).json({ message: "Fine paid must be checked if fine > 0" });
  }

  tx.finePaid = tx.fine > 0 ? true : !!finePaid;
  if (remarks !== undefined) tx.remarks = remarks;
  tx.status = "returned";
  await tx.save();

  res.json(tx);
};

export const listMyTransactions = async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { userId: req.user._id };
  const txs = await Transaction.find(filter)
    .populate("bookId", "name author serialNumber type")
    .populate("userId", "name userId role")
    .sort({ createdAt: -1 });
  res.json(txs);
};

