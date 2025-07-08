
const asyncHandler = require("express-async-handler");
const response = require("../utils/response");
const { company } = require("../models/zindex");
const scanrecord = require("../models/scanrecord");

exports.createScanRecord = asyncHandler(async (req, res) => {
  const { scannerId } = req.body; // who scanned
  const { scanId } = req.params;  // who got scanned

  console.log(scannerId,"scanner id");
  console.log(scanId,"scan id");
  

  if (!scannerId || !scanId) {
    return response.badRequest("Both scanId and scannerId are required.", res);
  }

  // Validate companies
  const scanned = await company.findById(scanId);
  const scanner = await company.findById(scannerId);

  if (!scanned || !scanner) {
    return response.notFound("Company not found.", res);
  }

  const newScan = await scanrecord.create({
    scanId,
    scannerId
  });

  return response.success("Scan record saved.", newScan, res);
});
