const path = require('path');
const multer = require('multer');

// Upload middleware
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(
      file.originalname,
    )}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: multerStorage,
  limits: {
    fileSize: 1000000 * 100,
  },
});

exports.uploadFile = upload.single('myfile');
