
const express = require("express");
const router = express.Router();
const slotController = require("../controllers/bookings");
const { superAdminAuthToken, companyAuthToken } = require("../middlewares/authenticator");

// Super Admin Creates Slots
router.post('/admin/slots/create', superAdminAuthToken, slotController.createSlots);

// User Books a Pair Slot
router.post('/pair-slots/book', companyAuthToken, slotController.bookPairSlot);

// Approve Pair Slot
router.patch('/pair-slots/approve/:slotId', companyAuthToken, slotController.approvePairSlot);

// Get Available Pair Slots
router.get('/pair-slots/:date/:withUserId', companyAuthToken, slotController.getAvailablePairSlots);

module.exports = router;