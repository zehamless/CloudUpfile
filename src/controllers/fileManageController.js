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

async function getPath(userId, id) {
  try {
    const file = await File.findById(id);
    if (!file || typeof file.filename !== 'string') {
      throw new Error('Invalid file');
    }
    const filePath = path.join('uploads', userId, file.filename);
    return filePath;
  } catch (error) {
    console.error('Error while getting file path:', error);
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



    

module.exports = { getFiles, deleteFile, getPath };
