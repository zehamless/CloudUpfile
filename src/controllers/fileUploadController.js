const multer = require("multer");
const path = require("path");
const fs = require("fs-extra");
const { File } = require("../models/file");
const { default: mongoose } = require("mongoose");
const { User } = require("../models/user");

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const username = req.user.id;
    const destinationFolder = path.join("uploads", username);
    try {
      await fs.mkdir(destinationFolder, { recursive: true });
      cb(null, destinationFolder);
    } catch (err) {
      console.error("Error creating directory:", err);
      cb(err, null);
    }
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10, // 10MB file size limit
  },
});

upload.fileHandler = async (req, res, next) => {
  const session = await mongoose.startSession();
  const file = req.file;
  const fileSizeInBytes = file.size;
  const fileType = path.extname(file.originalname).toLowerCase();
  
  
  const fileData = {
    filename: file.originalname,
    owner: req.user ? req.user.id : null, // Check if req.user exists before accessing its id
    size: fileSizeInBytes,
    type: fileType,
    path: file.path,
    date: Date.now(),
  };
  
  console.log("User:", req.user.id);
  user = await User.findById(req.user.id);

  session.startTransaction();
  try {
    const savedFile = await File.create(fileData);
    console.log("File saved to MongoDB:", savedFile);
    if (user) {
      user.Files.push(savedFile);
      await user.save();
      await session.commitTransaction();
    }

    // Perform additional actions with the saved file if needed
    next();
  } catch (err) {
    console.error("Error saving file to MongoDB:", err);
    await session.abortTransaction();
    // Handle the error and send an appropriate response
    res.status(500).send("Error saving file");
  }
  finally {
    session.endSession();
  }
};



module.exports = upload;
