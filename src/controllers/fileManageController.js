const fs = require('fs-extra');
const path = require('path');
const { User } = require('../models/user');
const { File } = require('../models/file');
const session = require('express-session');
const { default: mongoose } = require('mongoose');

async function getFiles(username) {
  try {

      const user = await User.findById(username).populate('Files');
      if (!user) {
        throw new Error('User not found');
      }
      const files = user.Files;
      // console.log('Files:', files);
      return files;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function renameFile(id, newName) {
  try {
    const file = await File.findById(id);
    if (!file) {
      throw new Error('File not found');
    }

    file.filename = newName;
    return await file.save();
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function deleteFile(userId, id) {
  const session = await mongoose.startSession()
  session.startTransaction();
  try {
    const file = await File.findById(id);
    const user = await User.findById(userId);
    if (!file) {
      return false; // File not found or already deleted
    }

    const filePath = path.join('uploads', userId, file.filename);
    await file.deleteOne();
    user.Files.pull(file);
    await user.save();


    fs.unlinkSync(filePath);
    await session.commitTransaction();
    return true;
  } catch (err) {
    await session.abortTransaction();
    console.error(err);
    return false;
  }finally{
    session.endSession();
  }
}



    

module.exports = { getFiles, renameFile, deleteFile };
