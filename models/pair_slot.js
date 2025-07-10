const mongoose = require("mongoose");

const pairSlotSchema = new mongoose.Schema({
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true }],
  isApproved: { type: Boolean, default: false },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true }
}, { timestamps: true });

module.exports = mongoose.model("PairSlot", pairSlotSchema);