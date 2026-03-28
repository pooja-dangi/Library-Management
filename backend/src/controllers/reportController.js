import Book from "../models/Book.js";
import Membership from "../models/Membership.js";
import Transaction from "../models/Transaction.js";
import { startOfDay } from "../utils/date.js";

export const masterBooks = async (req, res) => {
  const rows = await Book.find({ type: "book" }).sort({ name: 1, author: 1 });
  res.json(rows);
};

export const masterMemberships = async (req, res) => {
  const rows = await Membership.find().sort({ createdAt: -1 });
  res.json(rows);
};

export const activeIssues = async (req, res) => {
  const filter = { status: "issued" };
  const rows = await Transaction.find(filter)
    .populate("bookId", "name author serialNumber type")
    .populate("userId", "name userId contact")
    .sort({ issueDate: -1 });
  res.json(rows);
};

export const overdueReturns = async (req, res) => {
  const today = startOfDay(new Date());
  const filterBase = { status: { $in: ["issued", "overdue"] }, returnDate: { $lt: today } };
  const filter = { status: { $in: ["issued", "overdue"] }, returnDate: { $lt: today } };
  const rows = await Transaction.find(filter)
    .populate("bookId", "name author serialNumber type")
    .populate("userId", "name userId contact")
    .sort({ returnDate: 1 });
  res.json(rows);
};

export const pendingIssueRequests = async (req, res) => {
  const filter = { status: "pending_issue" };
  const rows = await Transaction.find(filter)
    .populate("bookId", "name author serialNumber type")
    .populate("userId", "name userId contact")
    .sort({ createdAt: -1 });
  res.json(rows);
};

