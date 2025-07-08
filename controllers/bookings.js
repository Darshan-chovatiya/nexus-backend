const UserSlot = require('../models/users_slots');
const PairSlot = require('../models/pair_slot');
const asyncHandler = require("express-async-handler");
function generateTimeSlots() {
  const start = 11 * 60;
  const end = 14 * 60;
  const slots = [];

  for (let i = start; i < end; i += 10) {
    const h1 = String(Math.floor(i / 60)).padStart(2, '0');
    const m1 = String(i % 60).padStart(2, '0');
    const h2 = String(Math.floor((i + 10) / 60)).padStart(2, '0');
    const m2 = String((i + 10) % 60).padStart(2, '0');

    slots.push({ startTime: `${h1}:${m1}`, endTime: `${h2}:${m2}` });
  }

  return slots;
}

// POST /admin/slots/create
exports.createSlots = asyncHandler(async (req, res) => {
  const { date } = req.body;

  if (!date) {
    return res.status(400).json({ error: "Date is required" });
  }

  // Delete existing slots for this date
  await UserSlot.deleteOne({ date });

  // Create 10-min slots from 11:00 to 14:00
  const slots = generateTimeSlots();

  const created = await UserSlot.create({ date, slots });
  res.status(201).json({ message: "Global slots created", data: created });
});

// POST /bookings/pair-slots/book
exports.bookPairSlot = asyncHandler(async (req, res) => {
  const { date, slotId, withUserId } = req.body;
  const currentUserId = req.user._id;

  if (!date || !slotId || !withUserId) {
    return res.status(400).json({ error: "Date, slotId, and withUserId are required" });
  }

  if (currentUserId.toString() === withUserId) {
    return res.status(400).json({ error: "Cannot book a slot with yourself" });
  }

  // Find the global slot to get startTime and endTime
  const userSlot = await UserSlot.findOne({ date });
  if (!userSlot) {
    return res.status(404).json({ error: "No slots found for this date" });
  }

  const slot = userSlot.slots.id(slotId);
  if (!slot) {
    return res.status(404).json({ error: "Slot not found" });
  }

  // Check if this time is already booked by currentUser or withUser
  const alreadyBooked = await PairSlot.findOne({
    date,
    startTime: slot.startTime,
    endTime: slot.endTime,
    users: { $in: [currentUserId, withUserId] }
  });

  if (alreadyBooked) {
    return res.status(400).json({ error: "This slot is already booked for one of the users" });
  }

  const booked = await PairSlot.create({
    date,
    startTime: slot.startTime,
    endTime: slot.endTime,
    users: [currentUserId, withUserId]
  });

  // Mark the global slot as booked
  slot.isBooked = true;
  slot.bookedBy = currentUserId;
  await userSlot.save();

  res.status(201).json({ message: "Pair slot booked", data: booked });
});

// GET /bookings/pair-slots/:date/:withUserId
exports.getAvailablePairSlots = asyncHandler(async (req, res) => {
  const { date, withUserId } = req.params;
  const currentUserId = req.user._id;

  if (currentUserId.toString() === withUserId) {
    return res.status(400).json({ error: "Cannot book a slot with yourself" });
  }

  const userSlot = await UserSlot.findOne({ date });
  if (!userSlot) {
    return res.json([]);
  }

  // Fetch booked pair slots involving currentUser or withUser
  const bookedPairSlots = await PairSlot.find({
    date,
    users: { $in: [currentUserId, withUserId] }
  });

  const bookedSet = new Set(
    bookedPairSlots.map(slot => `${slot.startTime}-${slot.endTime}`)
  );

  const available = userSlot.slots.filter(slot => {
    const key = `${slot.startTime}-${slot.endTime}`;
    return !bookedSet.has(key);
  });

  res.json(available);
});

// PATCH /bookings/pair-slots/approve/:slotId
exports.approvePairSlot = asyncHandler(async (req, res) => {
  const { slotId } = req.params;

  const pairSlot = await PairSlot.findById(slotId);
  if (!pairSlot) {
    return res.status(404).json({ error: "Pair slot not found" });
  }

  // Update the corresponding global slot
  const userSlot = await UserSlot.findOne({ date: pairSlot.date });
  if (!userSlot) {
    return res.status(404).json({ error: "No slots found for this date" });
  }

  const slot = userSlot.slots.find(s =>
    s.startTime === pairSlot.startTime && s.endTime === pairSlot.endTime
  );
  if (!slot) {
    return res.status(404).json({ error: "Slot not found" });
  }

  slot.isApproved = true;
  pairSlot.isApproved = true;
  await userSlot.save();
  await pairSlot.save();

  res.json({ message: "Pair slot approved", slot });
});