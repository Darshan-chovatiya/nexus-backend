const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const dir = path.join(__dirname, '..', 'uploads', 'banners');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function(req, file, cb) {
    const unique = Date.now() + '_' + file.originalname.replace(/\s+/g, '_');
    cb(null, unique);
  }
});
const bannerUpload = multer({ storage });

module.exports = bannerUpload;
