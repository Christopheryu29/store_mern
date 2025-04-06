import Invoice from "../models/invoice.model.js";
import { errorHandler } from "../utils/error.js";

// GET /api/customer
export const getCustomers = async (req, res, next) => {
  try {
    const invoices = await Invoice.find();

    const customerMap = new Map();

    for (const invoice of invoices) {
      const name = invoice.buyerName.trim().toLowerCase();
      const existing = customerMap.get(name) || {
        buyerName: invoice.buyerName,
        totalSpent: 0,
        orders: 0,
      };

      existing.totalSpent += invoice.total;
      existing.orders += 1;

      customerMap.set(name, existing);
    }

    const customers = Array.from(customerMap.values()).sort(
      (a, b) => b.totalSpent - a.totalSpent
    );

    res.status(200).json(customers);
  } catch (error) {
    next(error);
  }
};

// GET /api/customer/:buyerName
export const getCustomerInvoices = async (req, res, next) => {
  try {
    const buyerName = req.params.buyerName;

    const invoices = await Invoice.find({ buyerName }).sort({ date: -1 });
    res.status(200).json(invoices);
  } catch (error) {
    next(error);
  }
};
