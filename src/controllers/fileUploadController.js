const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const username = req.user.id;
      const destinationFolder = path.join("uploads", username);
      if (!fs.existsSync(destinationFolder)) {
        fs.mkdirSync(destinationFolder, { recursive: true });
      }
      cb(null, destinationFolder);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });
  
const upload = multer({ storage: storage, limits: {
    fileSize: 1024 * 1024 * 10
} });

module.exports = upload;