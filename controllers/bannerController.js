const Banner = require('../models/banner');
const fs = require('fs');
const path = require('path');

exports.addBanner = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
    const newBanner = new Banner({ imageUrl: `/uploads/banners/${req.file.filename}` });
    await newBanner.save();
    res.status(201).json(newBanner);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ uploadedAt: -1 });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

    const banner = await Banner.findById(id);
    if (!banner) return res.status(404).json({ error: 'Banner not found' });

    // delete old image
    const oldPath = path.join(__dirname, '..', banner.imageUrl);
    fs.existsSync(oldPath) && fs.unlinkSync(oldPath);

    banner.imageUrl = `/uploads/banners/${req.file.filename}`;
    banner.uploadedAt = Date.now();
    await banner.save();

    res.json(banner);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id);
    if (!banner) return res.status(404).json({ error: 'Banner not found' });

    const imgPath = path.join(__dirname, '..', banner.imageUrl);
    fs.existsSync(imgPath) && fs.unlinkSync(imgPath);

    await Banner.findByIdAndDelete(id);
    res.json({ message: 'Banner deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
