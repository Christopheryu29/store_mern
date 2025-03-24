import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
  quantitySold: { type: Number, required: true },
  totalRevenue: { type: Number, required: true },
  buyerName: { type: String, required: true }, // NEW
  soldBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const Sale = mongoose.model("Sale", saleSchema);
export default Sale;
