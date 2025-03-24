import Item from "../models/item.model.js";
import { errorHandler } from "../utils/error.js";

// Get all items
export const getItems = async (req, res, next) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    next(error);
  }
};

// Add a new item
export const addItem = async (req, res, next) => {
  try {
    const { name, quantity, price } = req.body;

    if (!name || quantity == null || price == null) {
      return next(errorHandler(400, "All fields are required!"));
    }

    const newItem = new Item({
      name,
      quantity,
      price,
      createdBy: req.user.id,
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    next(error);
  }
};

// Update item
export const updateItem = async (req, res, next) => {
  try {
    const { name, quantity, price } = req.body;

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { $set: { name, quantity, price } },
      { new: true }
    );

    if (!updatedItem) return next(errorHandler(404, "Item not found!"));

    res.status(200).json(updatedItem);
  } catch (error) {
    next(error);
  }
};

// Delete item
export const deleteItem = async (req, res, next) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) return next(errorHandler(404, "Item not found!"));

    res.status(200).json({ message: "Item deleted successfully!" });
  } catch (error) {
    next(error);
  }
};
