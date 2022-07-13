/*
 * Project: COMP1320 Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 * 
 * Created Date: 
 * Author: 
 * 
 */

const { createReadStream, createWriteStream } = require('fs');
const unzipper = require('unzipper'),
      fs       = require("fs"),
      PNG      = require('pngjs').PNG,
      path     = require('path');


/**
 * Description: decompress file from given pathIn, write to given pathOut 
 *  
 * @param {string} pathIn 
 * @param {string} pathOut 
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {
    createReadStream(pathIn)
      .pipe(unzipper.Extract({ path: pathOut }))
      .on('error', reject)
      .on('finish', resolve)
  })
  // createReadStream(pathIn)
  //   .pipe(unzipper.Extract({ path: pathOut }))
  //   .promise()
};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path 
 * 
 * @param {string} path 
 * @return {promise}
 */
const readDir = dir => {
  return new Promise((res, rej) => {
    fs.readdir(dir, (err, filenames) => {
      if(err) {
        rej(err)
      } else {
        const filteredArray = filenames.filter(filename => {
          return path.extname(filename) == ".png"
        })
        res(filteredArray)
      }
    })
  })
};

/**
 * Description: Read in png file by given pathIn, 
 * convert to grayscale and write to given pathOut
 * 
 * @param {string} filePath 
 * @param {string} pathProcessed 
 * @return {promise}
 */
const grayScale = (pathIn, pathOut, index) => {
  createReadStream(`unzipped/${pathIn}`)
  .pipe(
    new PNG({
      filterType: 4,
    })
  )
  .on("parsed", function () {
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        var idx = (this.width * y + x) << 2;

        const gray = (this.data[idx] + this.data[idx + 1] + this.data[idx + 2])/3;

        this.data[idx] = gray;
        this.data[idx + 1] = gray;
        this.data[idx + 2] = gray;
      }
    }
    this.pack().pipe(createWriteStream(`${pathOut}/in${index}.png`));
  });
};

module.exports = {
  unzip,
  readDir,
  grayScale
};