// Backend: Update routes/bookings.js
const express = require("express");
const router = express.Router();
const slotController = require("../controllers/bookings");
const { superAdminAuthToken, companyAuthToken } = require("../middlewares/authenticator");

// Super Admin Creates Slots
router.post('/admin/slots/create', superAdminAuthToken, slotController.createSlots);

// User Books a Pair Slot (now creates a pending request)
router.post('/pair-slots/book', companyAuthToken, slotController.bookPairSlot);

// Approve Pair Slot
router.patch('/pair-slots/approve/:slotId', companyAuthToken, slotController.approvePairSlot);

// Cancel/Reject Pair Slot Request
router.delete('/pair-slots/cancel/:slotId', companyAuthToken, slotController.cancelPairSlot);

// Get Available Pair Slots
router.get('/pair-slots/:date/:withUserId', companyAuthToken, slotController.getAvailablePairSlots);

// Get My Bookings (Approved)
router.get("/pair-slot/booked", companyAuthToken, slotController.getMyPairBookings);

// Get Sent Pending Requests
router.get("/pair-slot/pending-sent", companyAuthToken, slotController.getPendingSentRequests);

// Get Received Pending Requests
router.get("/pair-slot/pending-received", companyAuthToken, slotController.getPendingReceivedRequests);

module.exports = router;