import mongoose from "mongoose";

const storeSettingsSchema = new mongoose.Schema(
  {
    storeName: { type: String, required: true },
    address: { type: String },
    phone: { type: String },
    logoUrl: { type: String },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const StoreSettings = mongoose.model("StoreSettings", storeSettingsSchema);
export default StoreSettings;
