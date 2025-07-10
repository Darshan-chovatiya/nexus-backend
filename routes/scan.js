// routes/scan.js
const express = require('express');
const { createScanRecord, getScanUserData, getScannerDetails } = require('../controllers/scanController');
const { companyAuthToken } = require('../middlewares/authenticator');
const router = express.Router();

// POST /api/scan/:scanId
router.post('/:scanId', createScanRecord);

router.get('/user/:userId', getScanUserData);

router.get('/scanner',companyAuthToken, getScannerDetails);


module.exports = router;
