const fs = require('fs-extra');
const path = require('path');


function getFiles(username) {
    return new Promise((resolve, reject) => {
      if (!username) {
        reject(new Error("Invalid username"));
        return;
      }
  
      const destinationFolder = path.join("uploads", username);
  
      fs.ensureDir(destinationFolder)
        .then(() => {
          fs.readdir(destinationFolder)
            .then(files => {
              resolve(files);
            })
            .catch(err => {
              reject(err);
            });
        })
        .catch(err => {
          reject(err);
        });
    });
  }
module.exports = {getFiles};