const express = require('express');
const router = express.Router();
const { createReport, getReports, updateReportStatus } = require('../controllers/reportController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(auth); // All report routes require authentication

router.post('/', upload.array('evidence', 5), createReport);
router.get('/', getReports);
router.patch('/:id/status', updateReportStatus);

module.exports = router;
