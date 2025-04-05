import Invoice from "../models/invoice.model.js";
import Expense from "../models/expense.model.js";
import { errorHandler } from "../utils/error.js";

export const getFinancialSummary = async (req, res, next) => {
  try {
    if (req.user.role !== "owner") {
      return next(errorHandler(403, "Access denied"));
    }

    const invoices = await Invoice.find();

    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    let totalSales = 0;
    let dailySales = 0;
    let monthlySales = 0;
    const itemMap = new Map();

    for (const invoice of invoices) {
      const invoiceDate = new Date(invoice.date);

      totalSales += invoice.total;
      if (invoiceDate >= startOfDay) dailySales += invoice.total;
      if (invoiceDate >= startOfMonth) monthlySales += invoice.total;

      invoice.items.forEach(({ name, quantity, subtotal }) => {
        const existing = itemMap.get(name) || {
          quantitySold: 0,
          totalRevenue: 0,
        };
        existing.quantitySold += quantity;
        existing.totalRevenue += subtotal;
        itemMap.set(name, existing);
      });
    }

    const topItems = [...itemMap.entries()]
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5); // Top 5 items

    // Get expenses & debts this month
    const monthlyExpenses = await Expense.find({
      dueDate: { $gte: startOfMonth, $lte: today },
    });

    const totalExpenses = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
    const netProfit = monthlySales - totalExpenses;

    res.status(200).json({
      totalSales,
      dailySales,
      monthlySales,
      topItems,
      totalExpenses,
      netProfit,
    });
  } catch (error) {
    next(error);
  }
};
