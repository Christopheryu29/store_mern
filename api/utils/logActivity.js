import ActivityLog from "../models/activityLog.model.js";

export const logActivity = async (userId, action, metadata = {}) => {
  try {
    await ActivityLog.create({
      action,
      performedBy: userId,
      metadata,
    });
  } catch (err) {
    console.error("Failed to log activity:", err.message);
  }
};
