
const  multer = require ("multer");

// storage config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
      var ext = file.originalname.substring(file.originalname.lastIndexOf('.'))
      cb(null, file.filename + '-'+ Date.now()+ext);
    },
  });
  const upload = multer({ storage });
  module.exports = upload;
