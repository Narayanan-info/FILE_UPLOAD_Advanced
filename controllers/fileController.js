const { saveFileLocally } = require('../services/fileService');
const { calculateChecksum } = require('../utils/checksum');
const { scanFile } = require('../utils/virusScan');
const { renameFile, sanitizeFilename } = require('../utils/securityUtils');

exports.uploadFile = async (req, res, next) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const safeFilename = sanitizeFilename(file.originalname);
    const newFilename = renameFile(safeFilename);

    await scanFile(file.path);

    const savedFilePath = await saveFileLocally(file, newFilename);

    const checksum = await calculateChecksum(savedFilePath);

    res.status(200).json({
      message: 'File uploaded and saved successfully',
      filename: newFilename,
      checksum,
      path: savedFilePath,
    });
  } catch (err) {
    next(err);
  }
};
