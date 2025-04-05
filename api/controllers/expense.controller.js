import Expense from "../models/expense.model.js";
import { errorHandler } from "../utils/error.js";

// Add expense/debt
export const createExpense = async (req, res, next) => {
  try {
    const { title, amount, dueDate, type, storeName, note } = req.body;

    if (!title || !amount || !dueDate || !type)
      return next(errorHandler(400, "Missing fields"));

    const newExpense = new Expense({
      title,
      amount,
      dueDate,
      type,
      storeName: type === "debt" ? storeName : undefined,
      note,
      createdBy: req.user.id,
    });

    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    next(error);
  }
};

// Get all (owner only)
export const getAllExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find().sort({ dueDate: 1 });
    res.status(200).json(expenses);
  } catch (error) {
    next(error);
  }
};

// Delete
export const deleteExpense = async (req, res, next) => {
  try {
    const exp = await Expense.findByIdAndDelete(req.params.id);
    if (!exp) return next(errorHandler(404, "Not found"));
    res.status(200).json("Deleted");
  } catch (error) {
    next(error);
  }
};
