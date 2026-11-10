const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Detect serverless environment (Vercel / AWS Lambda) where filesystem is read-only except /tmp
const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const uploadsDir = isServerless ? os.tmpdir() : path.join(__dirname, '..', 'uploads');

try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (err) {
  console.warn('[Upload Warning] Could not ensure uploads directory:', err.message);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `receipt-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|webp|pdf/;
  const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  const mimetype = /image\/(jpeg|jpg|png|webp)|application\/pdf/.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, WEBP images and PDF receipts are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter,
});

module.exports = upload;
