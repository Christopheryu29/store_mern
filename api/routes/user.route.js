import express from "express";
import {
  test,
  updateUser,
  deleteUser,
  getAllUsers,
  createUser,
} from "../controllers/user.controller.js";
import { verifyToken, verifyOwner } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.put("/update/:id", verifyToken, updateUser);
router.get("/all", verifyToken, verifyOwner, getAllUsers);
router.post("/create", verifyToken, verifyOwner, createUser);
router.delete("/delete/:id", verifyToken, deleteUser);

export default router;
