import express from "express";
import { body } from "express-validator";
import { loginUser, registerUser } from "../controllers/authController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/login",
  [
    body("userId").notEmpty().withMessage("User ID is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  loginUser
);

router.post(
  "/register",
  protect,
  adminOnly,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("userId").notEmpty().withMessage("User ID is required"),
    body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
    body("role").optional().isIn(["admin", "user"]),
  ],
  registerUser
);

export default router;

