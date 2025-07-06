
const expressAsyncHandler = require('express-async-handler');
const slot = require('../models/slot');
const { company } = require('../models/zindex');

// Set available time slots
// router.post('/me/slots', auth, async (req, res) => {
exports.setavailableSlots = expressAsyncHandler(async (req, res) => {
  const { date } = req.body;
  const companyId = req.user._id;

  const user = await slot.findById(companyId);
  if (!user) return res.status(404).json({ message: "Company not found" });

  // Remove previous slots for this date
  company.availableSlots = company.availableSlots.filter(
    slot => slot.date.toISOString().split('T')[0] !== date
  );

  const start = 11 * 60;
  const end = 14 * 60;

  for (let mins = start; mins < end; mins += 10) {
    const h1 = Math.floor(mins / 60);
    const m1 = mins % 60;
    const h2 = Math.floor((mins + 10) / 60);
    const m2 = (mins + 10) % 60;

    company.availableSlots.push({
      date: new Date(date),
      startTime: `${h1.toString().padStart(2, '0')}:${m1.toString().padStart(2, '0')}`,
      endTime: `${h2.toString().padStart(2, '0')}:${m2.toString().padStart(2, '0')}`
    });
  }

  await company.save();
  res.json(company.availableSlots);
});



// Book a slot
// router.post('/:userId/slots/:slotId', auth, async (req, res) => {
exports.bookslot = expressAsyncHandler(async (req, res) => {
  const { userId, slotId } = req.params;
  const visitorAId = req.user._id;

  const targetUser = await slot.findById(userId);
  if (!targetUser) return res.status(404).json({ message: "User not found" });

  const slot = targetUser.availableSlots.id(slotId);
  if (!slot) return res.status(404).json({ message: "Slot not found" });

  if (slot.isBooked) {
    return res.status(400).json({ message: "Slot already booked" });
  }

  slot.isBooked = true;
  slot.bookedBy = visitorAId;
  slot.isApproved = false; // waiting for approval

  await targetUser.save();
  res.json({ message: "Slot booked, pending approval", slot });
});

exports.approveSlot = expressAsyncHandler(async (req, res) => {
  const { slotId } = req.params;
  const userId = req.user._id;

  const user = await slot.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const slot = company.availableSlots.id(slotId);
  if (!slot) return res.status(404).json({ message: "Slot not found" });

  if (!slot.isBooked) {
    return res.status(400).json({ message: "Cannot approve unbooked slot" });
  }

  slot.isApproved = true;
  await company.save();

  res.json({ message: "Slot approved", slot });
});


// Get available slots for a user
// router.get('/:userId/slots', auth, async (req, res) => {
exports.getavailableSlots = expressAsyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await slot.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const slots = company.availableSlots.filter(slot => !slot.isApproved);
  res.json(slots);
});


module.exports = router;