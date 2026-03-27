import Book from "../models/Book.js";
import Membership from "../models/Membership.js";
import Transaction from "../models/Transaction.js";
import { startOfDay } from "../utils/date.js";

export const masterBooks = async (req, res) => {
  const rows = await Book.find({ type: "book" }).sort({ name: 1, author: 1 });
  res.json(rows);
};

export const masterMovies = async (req, res) => {
  const rows = await Book.find({ type: "movie" }).sort({ name: 1, author: 1 });
  res.json(rows);
};

export const masterMemberships = async (req, res) => {
  const rows = await Membership.find().sort({ createdAt: -1 });
  res.json(rows);
};

export const activeIssues = async (req, res) => {
  const filter = req.user.role === "admin" ? { status: "issued" } : { status: "issued", userId: req.user._id };
  const rows = await Transaction.find(filter)
    .populate("bookId", "name author serialNumber type")
    .populate("userId", "name userId role")
    .sort({ issueDate: -1 });
  res.json(rows);
};

export const overdueReturns = async (req, res) => {
  const today = startOfDay(new Date());
  const filterBase = { status: { $in: ["issued", "overdue"] }, returnDate: { $lt: today } };
  const filter = req.user.role === "admin" ? filterBase : { ...filterBase, userId: req.user._id };
  const rows = await Transaction.find(filter)
    .populate("bookId", "name author serialNumber type")
    .populate("userId", "name userId role")
    .sort({ returnDate: 1 });
  res.json(rows);
};

export const pendingIssueRequests = async (req, res) => {
  const filter = req.user.role === "admin" ? { status: "pending_issue" } : { status: "pending_issue", userId: req.user._id };
  const rows = await Transaction.find(filter)
    .populate("bookId", "name author serialNumber type")
    .populate("userId", "name userId role")
    .sort({ createdAt: -1 });
  res.json(rows);
};

