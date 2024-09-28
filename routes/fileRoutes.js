const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const upload = require('../middleware/fileupload');

router.post('/', upload.single('file'), fileController.uploadFile);

module.exports = router;
