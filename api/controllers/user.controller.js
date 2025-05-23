import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import { logActivity } from "../utils/logActivity.js";

export const test = (req, res) => {
  res.json({ message: "Api route is working!" });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id && req.user.role !== "owner") {
    return next(errorHandler(401, "Unauthorized!"));
  }

  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    if (req.body.role && req.user.role !== "owner") {
      return next(errorHandler(403, "Only owners can change roles!"));
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    await logActivity(req.user.id, "updated user", {
      userId: updatedUser._id,
      username: updatedUser.username,
      role: updatedUser.role,
    });

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only delete your own account!"));
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    await logActivity(req.user.id, "deleted own account", {
      userId: deletedUser._id,
      username: deletedUser.username,
    });

    res.clearCookie("access_token");
    res.status(200).json("User has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(errorHandler(404, "User not found!"));

    const { password: pass, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// Get all users (owner only)
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// Create new user (owner only)
export const createUser = async (req, res, next) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password || !role) {
    return next(errorHandler(400, "All fields are required."));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({ username, email, password: hashedPassword, role });

  try {
    await newUser.save();

    await logActivity(req.user.id, "created staff", {
      userId: newUser._id,
      username,
      email,
      role,
    });

    res.status(201).json("User created successfully!");
  } catch (error) {
    next(error);
  }
};
