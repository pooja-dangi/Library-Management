import { validationResult } from "express-validator";
import Book from "../models/Book.js";

export const createBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, type, author, serialNumber, status, quantity, procurementDate } = req.body;

  const existing = await Book.findOne({ serialNumber });
  if (existing) return res.status(400).json({ message: "Serial number already exists" });

  const book = await Book.create({
    name,
    type,
    author,
    serialNumber,
    status,
    quantity: quantity ?? 1,
    procurementDate,
  });

  res.status(201).json(book);
};

export const updateBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });

  const fields = ["name", "type", "author", "serialNumber", "status", "quantity", "procurementDate"];
  for (const f of fields) {
    if (req.body[f] !== undefined) book[f] = req.body[f];
  }

  const updated = await book.save();
  res.json(updated);
};

export const getBooks = async (req, res) => {
  const { type } = req.query;
  const filter = {};
  if (type) filter.type = type;
  const books = await Book.find(filter).sort({ createdAt: -1 });
  res.json(books);
};

export const getBookById = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book);
};

export const deleteBook = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });
  await book.deleteOne();
  res.json({ message: "Book deleted" });
};

export const getNextBookId = async (req, res) => {
  try {
    const last = await Book.findOne().sort({ serialNumber: -1 });
    if (!last) return res.json({ nextId: "BK001" });

    const match = last.serialNumber.match(/^([a-zA-Z-]+)(\d+)$/);
    if (!match) return res.json({ nextId: "BK001" });

    const prefix = match[1];
    const numStr = match[2];
    const nextNum = parseInt(numStr, 10) + 1;
    const paddedNum = String(nextNum).padStart(numStr.length, "0");

    res.json({ nextId: `${prefix}${paddedNum}` });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

