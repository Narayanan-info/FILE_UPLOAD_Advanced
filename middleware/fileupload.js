const multer = require('multer');
const path = require('path');
const sanitize = require('sanitize-filename');
const crypto = require('crypto');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const sanitizedFileName = sanitize(file.originalname.split('.')[0]);
        const extension = path.extname(file.originalname);
        const uniqueName = crypto.randomBytes(16).toString('hex');
        cb(null, `${uniqueName}-${sanitizedFileName}${extension}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|pdf|svg/;
        const mimeType = allowedTypes.test(file.mimetype);
        const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());

        if (file.originalname.includes('../')) {
            return cb(new Error('Invalid file name'));
        }

        if (mimeType && extName) {
            return cb(null, true);
        } else {
            return cb(new Error('Unsupported file type. Only JPEG, PNG, PDF, and SVG are allowed.'));
        }
    }
});

module.exports = upload;
