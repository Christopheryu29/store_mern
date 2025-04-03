import express from "express";
import ActivityLog from "../models/activityLog.model.js";
import { verifyToken, verifyOwner } from "../utils/verifyUser.js";

const router = express.Router();

// GET /api/activity
router.get("/", verifyToken, verifyOwner, async (req, res, next) => {
  try {
    const logs = await ActivityLog.find()
      .populate("performedBy", "username email")
      .sort({ createdAt: -1 })
      .limit(100); // Optional: Add pagination later

    res.status(200).json(logs);
  } catch (err) {
    next(err);
  }
});

export default router;
