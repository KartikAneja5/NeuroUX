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
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });
module.exports = upload;
