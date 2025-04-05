import express from "express";
import {
  getSettings,
  updateSettings,
} from "../controllers/settings.controller.js";
import { verifyToken, verifyOwner } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/", verifyToken, verifyOwner, getSettings);
router.post("/", verifyToken, verifyOwner, updateSettings);

export default router;
