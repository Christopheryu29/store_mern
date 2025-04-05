import StoreSettings from "../models/settings.model.js";
import { errorHandler } from "../utils/error.js";

// GET store settings (owner only)
export const getSettings = async (req, res, next) => {
  try {
    const settings = await StoreSettings.findOne({ ownerId: req.user.id });
    res.status(200).json(settings);
  } catch (error) {
    next(error);
  }
};

// POST or UPDATE settings
export const updateSettings = async (req, res, next) => {
  try {
    const { storeName, address, phone, logoUrl } = req.body;

    let settings = await StoreSettings.findOne({ ownerId: req.user.id });

    if (settings) {
      settings.storeName = storeName;
      settings.address = address;
      settings.phone = phone;
      settings.logoUrl = logoUrl;
      await settings.save();
    } else {
      settings = await StoreSettings.create({
        storeName,
        address,
        phone,
        logoUrl,
        ownerId: req.user.id,
      });
    }

    res.status(200).json(settings);
  } catch (error) {
    next(error);
  }
};
