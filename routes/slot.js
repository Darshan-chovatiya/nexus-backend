
const express = require('express');
const { createScanRecord } = require('../controllers/scanController');
const router = express.Router();

router.post('/me/slots', auth, setavailableSlots); // company sets own slots
router.get('/:userId/slots', auth, getavailableSlots); // get slots of any user
router.post('/:userId/slots/:slotId/book', auth, bookslot); // book a slot
router.post('/me/slots/:slotId/approve', auth, approveSlot); // approve a booking


module.exports = router;
