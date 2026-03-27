import express from "express";
import { body } from "express-validator";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  approveIssueRequest,
  checkAvailability,
  issueBook,
  listMyTransactions,
  payFine,
  requestIssue,
  returnBook,
} from "../controllers/transactionController.js";

const router = express.Router();

router.use(protect);

router.get("/availability", checkAvailability);
router.get("/", listMyTransactions);

const issueValidation = [
  body("bookId").notEmpty().withMessage("bookId required"),
  body("issueDate").notEmpty().withMessage("issueDate required"),
  body("returnDate").notEmpty().withMessage("returnDate required"),
  body("remarks").optional().isString(),
];

router.post("/issue", issueValidation, issueBook);
router.post("/request-issue", issueValidation, requestIssue);
router.post("/approve/:id", adminOnly, approveIssueRequest);

router.post(
  "/return",
  [body("transactionId").notEmpty().withMessage("transactionId required"), body("actualReturnDate").optional()],
  returnBook
);

router.post(
  "/payfine",
  [
    body("transactionId").notEmpty().withMessage("transactionId required"),
    body("finePaid").optional().isBoolean(),
    body("remarks").optional().isString(),
  ],
  payFine
);

export default router;

