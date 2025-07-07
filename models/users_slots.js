const mongoose = require("mongoose");

let slotSchema = new mongoose.Schema({
  slot:{
    type: String,
    default: ""
  },
  isBooked: {
    type: Boolean,
    default: false
  },
  hasAppointment: {
    type: Boolean,
    default: false
  },
  isVisible: {
    type: Boolean,
    default: true
  },
  appointmentWith: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    } 
});

let schema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  date: {
    type: String,
    default: null
  },
  slots:[slotSchema]
});

module.exports = mongoose.model("UserSlots", schema);