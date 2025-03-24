import Sale from "../models/sale.model.js";
import Item from "../models/item.model.js";
import { errorHandler } from "../utils/error.js";

export const checkout = async (req, res, next) => {
  try {
    const { itemId, quantity, buyerName } = req.body;

    const item = await Item.findById(itemId);
    if (!item || item.quantity < quantity) {
      return next(errorHandler(400, "Insufficient stock!"));
    }

    const totalRevenue = item.price * quantity;

    const newSale = new Sale({
      item: itemId,
      quantitySold: quantity,
      totalRevenue,
      buyerName,
      soldBy: req.user.id,
    });

    await newSale.save();

    item.quantity -= quantity;
    await item.save();

    res.status(200).json({
      message: "Checkout successful!",
      sale: newSale,
    });
  } catch (error) {
    next(error);
  }
};
