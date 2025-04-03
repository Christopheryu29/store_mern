import Refund from "../models/refund.model.js";
import Item from "../models/item.model.js";
import { errorHandler } from "../utils/error.js";
import { logActivity } from "../utils/logActivity.js";

// POST: Create a refund
export const createRefund = async (req, res, next) => {
  try {
    const { itemId, quantity, reason } = req.body;

    const item = await Item.findById(itemId);
    if (!item) return next(errorHandler(404, "Item not found"));

    const refundAmount = quantity * item.price;

    const newRefund = new Refund({
      item: itemId,
      quantityReturned: quantity,
      refundAmount,
      reason,
      returnedBy: req.user.id,
    });

    await newRefund.save();

    // Update item stock
    item.quantity += quantity;
    await item.save();

    await logActivity(req.user.id, "issued refund", {
      item: item.name,
      quantity,
      refundAmount,
      reason,
    });

    res.status(201).json({ message: "Refund processed", refund: newRefund });
  } catch (error) {
    next(error);
  }
};

// GET: All refunds (owner only)
export const getAllRefunds = async (req, res, next) => {
  try {
    const refunds = await Refund.find()
      .populate("item")
      .populate("returnedBy", "username")
      .sort({ createdAt: -1 });

    res.status(200).json(refunds);
  } catch (error) {
    next(error);
  }
};
