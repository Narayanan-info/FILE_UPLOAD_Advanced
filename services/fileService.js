const fs = require('fs');
const crypto = require('crypto');

exports.computeFileChecksum = (filePath) => {
    return new Promise((resolve, reject) => {
        const fileBuffer = fs.readFileSync(filePath);
        const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
        resolve(hash);
    });
};
