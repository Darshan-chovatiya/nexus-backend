
const asyncHandler = require("express-async-handler");
const response = require("../utils/response");
const { company } = require("../models/zindex");
const scanrecord = require("../models/scanrecord");

exports.createScanRecord = asyncHandler(async (req, res) => {
  const { scannerId } = req.body; // who scanned
  const { scanId } = req.params;  // who got scanned

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


exports.getScanUserData = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const scan = await company.findById(userId);
  if (!scan) return response.notFound("Scan record not found.", res);
  return response.success("Scan record found.", scan, res);
});


exports.getScannerDetails = asyncHandler(async (req, res) => {
  const myCompanyId = req.user._id;

  // Find all scan records where I was scanned, and populate scannerId with company data
  const scanRecords = await scanrecord
    .find({ scanId: myCompanyId })
    .populate('scannerId', '-password -isActive'); // You can include more fields if needed

  return response.success("Scanners found.", scanRecords, res);
});


exports.getScanDetails = asyncHandler(async (req, res) => {
  const myCompanyId = req.user._id;

  // Find all scan records where I was scanned, and populate scannerId with company data
  const scanRecords = await scanrecord
    .find({ scannerId: myCompanyId })
    .populate('scanId', '-password -isActive'); // You can include more fields if needed

  return response.success("Scanners found.", scanRecords, res);
});
