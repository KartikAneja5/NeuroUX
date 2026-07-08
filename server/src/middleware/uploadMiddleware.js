const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'preview') {
      cb(null, 'uploads/previews/');
    } else if (file.fieldname === 'code') {
      cb(null, 'uploads/code/');
    } else {
      cb(new Error('Invalid fieldname'), false);
    }
  },
  filename: (req, file, cb) => {
    // Sanitize filename to remove special characters
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    cb(null, `${Date.now()}-${sanitized}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'preview') {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type for preview. Only JPG, PNG, and WEBP images are allowed.'), false);
    }
  } else if (file.fieldname === 'code') {
    const allowedTypes = [
      'application/zip', 
      'application/x-zip-compressed', 
      'application/x-tar', 
      'application/gzip',
      'application/x-gzip',
      'application/octet-stream' // fallback for raw binaries/zips on some systems
    ];
    if (allowedTypes.includes(file.mimetype) || file.originalname.endsWith('.zip')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type for code. Only ZIP archive files are allowed.'), false);
    }
  } else {
    cb(new Error('Unknown fieldname'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024 // 25MB max overall limit
  }
});

module.exports = upload;
