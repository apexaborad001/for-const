let path = require("path");
let multer = require('multer');
let storageObject = (storage_destination) => {
  var storage = multer.diskStorage({
    destination: function(req, file, callback) {
      callback(null, storage_destination);
    },
    filename: function(req, file, callback) {
      callback(null, req.files.image.name);
    }
  });
  return storage;
}

function uploadFiles(req, res, storage_destination, typeAllowedArr) {
  var upload = multer({
    storage: storageObject(storage_destination),
    fileFilter: function(req, file, cb) {
      if (!typeAllowedArr.includes(path.extname(req))) {
        return cb(` Only ${typeAllowedArr} are allowed`)
      }
      cb(null, true)
    }
  }).single('image');
  return new Promise((resolve, reject) => {
    upload(req, res, function(err) {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(req);
    });
  });
}

module.exports = {
  upload: uploadFiles
};