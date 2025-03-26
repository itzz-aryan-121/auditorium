import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  getUserDashboardStats,
  searchUsers,
} from "../controllers/userController.js";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";

const router = express.Router();

router.get("/profile", auth, getUserProfile);
router.put("/profile", auth, updateUserProfile);
router.get("/dashboard", auth, getUserDashboardStats);
router.get("/search", [auth, admin], searchUsers);

export default router;
