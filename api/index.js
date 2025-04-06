import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import saleRouter from "./routes/sale.route.js";
import itemRouter from "./routes/item.route.js";
import invoiceRouter from "./routes/invoice.route.js";
import financialRouter from "./routes/financial.route.js";
import activityRoute from "./routes/activity.route.js";
import refundRoute from "./routes/refund.route.js";
import expenseRoute from "./routes/expense.route.js";
import cookieParser from "cookie-parser";
import customerRoute from "./routes/customer.route.js";
import settingsRoute from "./routes/settings.route.js";

dotenv.config();
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

//allow json as input of the server
app.use(express.json());

app.use(cookieParser());

app.listen(3000, () => {
  console.log("Server is running on port 3000!!");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/sale", saleRouter);
app.use("/api/item", itemRouter);
app.use("/api/invoice", invoiceRouter);
app.use("/api/financial", financialRouter);
app.use("/api/activity", activityRoute);
app.use("/api/refund", refundRoute);
app.use("/api/expense", expenseRoute);
app.use("/api/settings", settingsRoute);
app.use("/api/customer", customerRoute);
app.get("/test", (req, res) => {
  res.send("Hello World!");
});

//middleware to handle possible errors
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
