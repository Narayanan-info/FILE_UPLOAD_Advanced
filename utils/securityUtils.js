const crypto = require('crypto');
const sanitize = require('sanitize-filename');

exports.sanitizeFilename = (filename) => {
  return sanitize(filename);
};

exports.renameFile = (filename) => {
  const fileExt = filename.split('.').pop();
  const hashedName = crypto.randomBytes(16).toString('hex');
  return `${hashedName}.${fileExt}`;
};
