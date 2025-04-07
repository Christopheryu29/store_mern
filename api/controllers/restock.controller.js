import Item from "../models/item.model.js";
import { errorHandler } from "../utils/error.js";

export const getLowStockItems = async (req, res, next) => {
  try {
    const threshold = parseInt(req.query.threshold) || 5; // default 5
    const items = await Item.find({ quantity: { $lt: threshold } }); //$lt is less than
    res.status(200).json(items);
  } catch (error) {
    next(error);
  }
};
