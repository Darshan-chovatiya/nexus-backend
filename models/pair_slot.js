const mongoose = require("mongoose");

const pairSlotSchema = new mongoose.Schema({
  date: { type: String, required: true }, // e.g., "2025-07-09"
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true }], // exactly 2 users
  isApproved: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("PairSlot", pairSlotSchema);