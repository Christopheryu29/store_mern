import Invoice from "../models/invoice.model.js";
import { errorHandler } from "../utils/error.js";
import { logActivity } from "../utils/logActivity.js";

// Create a new invoice
export const createInvoice = async (req, res, next) => {
  try {
    const { buyerName, date, items, total } = req.body;

    if (!buyerName || !date || !items || !total) {
      return next(errorHandler(400, "Missing invoice data."));
    }

    const newInvoice = new Invoice({
      buyerName,
      date,
      items,
      total,
      createdBy: req.user.id,
    });

    await newInvoice.save();

    await logActivity(req.user.id, "created invoice", {
      invoiceId: newInvoice._id,
      buyerName,
      total,
    });

    res.status(201).json({ message: "Invoice created!", invoice: newInvoice });
  } catch (error) {
    next(error);
  }
};

// Get all invoices (owners only)
export const getAllInvoices = async (req, res, next) => {
  try {
    if (req.user.role !== "owner") {
      return next(errorHandler(403, "Access denied"));
    }

    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.status(200).json(invoices);
  } catch (error) {
    next(error);
  }
};
