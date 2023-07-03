const fs = require('fs-extra');
const path = require('path');
const { User } = require('../models/user');
const { File } = require('../models/file');

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

module.exports = { getFiles };
