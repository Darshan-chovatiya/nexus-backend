// routes/scan.js
const express = require('express');
const { createScanRecord } = require('../controllers/scanController');
const router = express.Router();

// POST /api/scan/:scanId
router.post('/:scanId', createScanRecord);

module.exports = router;
