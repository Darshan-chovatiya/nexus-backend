const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  date: Date,
  startTime: String,   // "11:00"
  endTime: String,     // "11:10"
  isBooked: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Visitor', // or 'Company' if visitor-a is also a company
    default: null
  }
});

const companySchema = new mongoose.Schema({
  // existing fields...
  availableSlots: [slotSchema]
});

module.exports = mongoose.model("Company", companySchema);
