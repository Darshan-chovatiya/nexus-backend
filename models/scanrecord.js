// models/ScanRecord.js
const mongoose = require("mongoose");

const scanRecordSchema = new mongoose.Schema({
  scanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  scannerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  scannedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("ScanRecord", scanRecordSchema);
