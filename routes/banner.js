const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const bannerUpload = require('../utils/bannerUpload');
const { superAdminAuthToken } = require('../middlewares/authenticator');


router.post('/bannerss', superAdminAuthToken, bannerUpload.single('banner'), bannerController.addBanner);
router.get('/banners', bannerController.getBanners);
router.put('/banners/:id', superAdminAuthToken, bannerUpload.single('banner'), bannerController.updateBanner);
router.delete('/banners/:id', superAdminAuthToken, bannerController.deleteBanner);

module.exports = router;
