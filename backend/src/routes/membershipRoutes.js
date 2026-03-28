import express from "express";
import { body } from "express-validator";
import {
  createMembership,
  deleteMembership,
  getMembershipById,
  getMemberships,
  updateMembership,
  getNextMemberId, // Add this
} from "../controllers/membershipController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const membershipValidation = [
  body("memberId").notEmpty().withMessage("memberId is required"),
  body("name").notEmpty().withMessage("name is required"),
  body("contact").notEmpty().withMessage("contact is required"),
  body("aadhaar").notEmpty().withMessage("aadhaar is required"),
  body("startDate").notEmpty().withMessage("startDate is required"),
  body("endDate").notEmpty().withMessage("endDate is required"),
  body("membershipType")
    .isIn(["6_months", "1_year", "2_years"])
    .withMessage("membershipType invalid"),
  body("status").optional().isIn(["active", "expired"]),
];

router.use(protect, adminOnly);

router.get("/", getMemberships);
router.get("/next-id", getNextMemberId); // Add before :id
router.get("/:id", getMembershipById);
router.post("/", membershipValidation, createMembership);
router.put("/:id", membershipValidation, updateMembership);
router.delete("/:id", deleteMembership);

export default router;

