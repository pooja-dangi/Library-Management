import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  activeIssues,
  masterBooks,
  masterMemberships,
  masterMovies,
  overdueReturns,
  pendingIssueRequests,
} from "../controllers/reportController.js";

const router = express.Router();

router.use(protect);

router.get("/master/books", masterBooks);
router.get("/master/movies", masterMovies);
router.get("/master/memberships", masterMemberships);
router.get("/active-issues", activeIssues);
router.get("/overdue-returns", overdueReturns);
router.get("/pending-issue-requests", pendingIssueRequests);

export default router;

