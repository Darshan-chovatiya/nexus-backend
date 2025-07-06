const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  prefix: {
    type: String,
    enum: ['Mr', 'Mrs', 'Ms', 'Dr'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  profileImage: {
    type: String,
    default: ''
  },
  aboutBusiness: {
    type: String,
    required: true
  },
  aboutProduct: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Pure B2B', 'Pure B2C', 'B2B + B2C'],
    required: true
  },
  availableSlots: [{
    date: Date,
    startTime: String, // Format: "HH:MM"
    endTime: String,
    isBooked: {
      type: Boolean,
      default: false
    },
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  role: {
    type: String,
    default: 'user'
  }
}, { timestamps: true });

module.exports = mongoose.model("Company", companySchema);
