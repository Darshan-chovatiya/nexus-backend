const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  isBooked: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Company", default: null },
});

const userSlotSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true },
  slots: [slotSchema],
}, { timestamps: true });

module.exports = mongoose.model("UserSlot", userSlotSchema);

