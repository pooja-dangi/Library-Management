import express from "express";
import { body } from "express-validator";
import { listUsers, updateUser } from "../controllers/userController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/", listUsers);
router.put(
  "/:id",
  [
    body("name").optional().isString(),
    body("isActive").optional().isBoolean(),
    body("role").optional().isIn(["admin", "user"]),
  ],
  updateUser
);

export default router;

