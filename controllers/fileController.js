const { saveFileLocally } = require('../services/fileService');
const { renameFile, sanitizeFilename, computeFileChecksum } = require('../utils/checksum');
const xss = require('xss');
const fs = require('fs');
const sharp = require('sharp')

exports.uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const validFileTypes = ['image/jpeg', 'image/png', 'application/pdf', 'image/svg+xml'];
    if (!validFileTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ error: 'Invalid file type. Only JPEG, PNG, PDF, and SVG are allowed.' });
    }

    if (req.file.mimetype === 'image/jpeg, image/png') {
      try{
        const sanitizedImagePath = `sanitized-${req.file.filename}`;
        await sharp(req.file.path)
          .withMetadata({ exif: false })
          .toFile(sanitizedImagePath);

        fs.unlinkSync(req.file.path); 
        fs.renameSync(sanitizedImagePath, req.file.path);

      } catch (err) {
        return res.status(500).json({ error: 'Error processing JPEG file' });
      }
    }

    if (req.file.mimetype === 'image/svg+xml') {
      const fileContent = fs.readFileSync(req.file.path, 'utf8');
      const sanitizedSVG = xss(fileContent);

      if (sanitizedSVG !== fileContent) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: 'SVG contains embedded JavaScript, upload rejected.'});
      }
    }

    if (req.file.mimetype === 'application/pdf') {
      const fileContent = fs.readFileSync(req.file.path, 'utf8');
      if (fileContent.includes('/JavaScript')) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: 'PDF contains embedded JavaScript, upload rejected.' });
      }
    }

    const checksum = await computeFileChecksum(req.file.path);

    res.json({
      message: 'File uploaded successfully!',
      filename: req.file.filename,
      originalname: req.file.originalname,
      checksum: checksum,
      size: req.file.size,
      path: req.file.path,
    });
  } catch (error) {
    console.error('Error during file upload:', error);
    res.status(500).json({ error: 'Error processing file' });
  }
};
