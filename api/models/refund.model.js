import mongoose from "mongoose";

const refundSchema = new mongoose.Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    quantityReturned: { type: Number, required: true },
    refundAmount: { type: Number, required: true },
    reason: { type: String, required: true },
    returnedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Refund = mongoose.model("Refund", refundSchema);
export default Refund;
