const crypto = require('crypto');
const fs = require('fs');

const computeFileChecksum = (filePath) => {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('sha256');
        const fileStream = fs.createReadStream(filePath);

        fileStream.on('data', (data) => {
            hash.update(data);
        });

        fileStream.on('end', () => {
            resolve(hash.digest('hex'));
        });

        fileStream.on('error', (err) => {
            reject(err);
        });
    });
};

module.exports = { computeFileChecksum };
