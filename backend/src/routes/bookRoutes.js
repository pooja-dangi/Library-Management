import express from "express";
import { body } from "express-validator";
import {
  createBook,
  deleteBook,
  getBookById,
  getBooks,
  updateBook,
  getNextBookId,
} from "../controllers/bookController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const bookValidation = [
  body("type").isIn(["book"]).withMessage("type must be book"),
  body("name").notEmpty().withMessage("name is required"),
  body("author").notEmpty().withMessage("author is required"),
  body("serialNumber").notEmpty().withMessage("serialNumber is required"),
  body("status")
    .isIn(["available", "issued", "lost", "maintenance"])
    .withMessage("status invalid"),
  body("quantity").optional().isInt({ min: 1 }).withMessage("quantity must be >= 1"),
  body("procurementDate").notEmpty().withMessage("procurementDate is required"),
];

router.use(protect);

// Admin maintenance CRUD
router.get("/", getBooks); // allow users to list for dropdowns
router.get("/next-id", adminOnly, getNextBookId);
router.get("/:id", getBookById);
router.post("/", adminOnly, bookValidation, createBook);
router.put("/:id", adminOnly, bookValidation, updateBook);
router.delete("/:id", adminOnly, deleteBook);

export default router;

