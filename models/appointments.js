const mongoose = require("mongoose");

let schema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  slotId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  appointmentDate: {
    type: String,
    default: null
  },
  appointmentWith: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  isApproved: {
    type: Boolean,
    default: null
  },
}, {timestamps: true});

module.exports = mongoose.model("UserSlots", schema);