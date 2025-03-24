import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    buyerName: { type: String, required: true },
    date: { type: Date, required: true },
    items: [
      {
        name: String,
        quantity: Number,
        unitPrice: Number,
        subtotal: Number,
      },
    ],
    total: { type: Number, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;
