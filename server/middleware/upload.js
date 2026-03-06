const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Broadened allowed types to accommodate evidence files
    const allowedTypes = /jpeg|jpg|png|svg|log|txt|pdf|doc|docx|csv|xls|xlsx|ppt|pptx|zip|rar/i;

    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    // Some files like csv might have different mimetypes depending on OS, simplify validation:
    // Mimetype isn't always reliable for all generic file types sent from browser FormData
    if (extname) {
        return cb(null, true);
    } else {
        cb(new Error('Invalid file type. Allowed: Images, PDFs, Documents, and Archives.'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: fileFilter
});

module.exports = upload;
