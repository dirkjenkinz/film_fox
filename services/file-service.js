'use strict';

// Import necessary modules and dependencies
const fs = require('fs');
const path = require('path');
const mp3Duration = require('mp3-duration');
const sound = require('sound-play');

// Constants for directory paths
const dataDirectoryPath = path.join(__dirname, '../data');

// Check if a file exists
const fileExists = async (file) => {
  console.log(`Checking for file: ${file}`);
  const filePath = path.join(dataDirectoryPath, file);

  return new Promise((resolve, reject) => {
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error(`File ${file} does not exist.`);
        reject(new Error(`File ${file} does not exist.`));
      } else {
        resolve(true);
      }
    });
  });
};

// Rename a file
const renameFile = async (title, directory, from, to) => {
  console.log(`Renaming file from ${from} to ${to}`);
  const filePath = path.join(dataDirectoryPath, title, directory, from);
  const newFilePath = path.join(dataDirectoryPath, title, directory, to);

  return new Promise((resolve, reject) => {
    fs.rename(filePath, newFilePath, (err) => {
      if (err) {
        console.error('Error renaming file:', err);
        reject(err);
      } else {
        resolve('ok');
      }
    });
  });
};

// Read the content of the sheet.njk file
const getSheet = async () => {
  console.log('Getting sheet');
  const sheetPath = path.join(__dirname, '../pages/sheet.njk');

  return new Promise((resolve, reject) => {
    fs.readFile(sheetPath, (err, data) => {
      if (err) {
        console.error('Error getting sheet data:', err);
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

// Read the content of a file and parse it as JSON
const getFile = async (file) => {
  console.log(`Getting data for ${file}`);
  const filePath = path.join(dataDirectoryPath, file);

  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error getting file data:', err);
        reject(err);
      } else {
        try {
          resolve(JSON.parse(data));
        } catch (parseError) {
          console.error('Error parsing JSON data:', parseError);
          reject(parseError);
        }
      }
    });
  });
};

// Read the content of a script file
const readScriptData = async (file) => {
  console.log(`Getting script data for ${file}`);
  const scriptPath = path.join(__dirname, '../scripts', file);

  return new Promise((resolve, reject) => {
    fs.readFile(scriptPath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading script data:', err);
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

// Play a sound file using the sound-play library
const playSoundFile = async (title, file, sub) => {
  console.log(`Playing sound file: ${title}/${sub}/${file}`);
  const filePath = path.join(dataDirectoryPath, title, sub, file);

  try {
    await sound.play(filePath);
    console.log('Sound play completed');
  } catch (error) {
    console.error('Error playing sound file:', error);
  }
};

// Write data to a file
const writeFile = async (data, file) => {
  console.log(`Writing to file: ${file}`);
  const filePath = path.join(dataDirectoryPath, file);

  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, 'utf8', (err) => {
      if (err) {
        console.error('Error writing file:', err);
        reject(err);
      } else {
        resolve('ok');
      }
    });
  });
};

// Delete a file
const deleteFile = async (title, directory, fileName) => {
  console.log(`Deleting file: ${title}/${directory}/${fileName}`);
  const filePath = path.join(dataDirectoryPath, title, directory, fileName);

  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
        reject(err);
      } else {
        resolve('ok');
      }
    });
  });
};

// Create a directory if it doesn't exist
const createDirectory = (directory) => {
  console.log(`Creating directory: ${directory}`);
  const dirPath = path.join(dataDirectoryPath, directory);

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Get the duration of an MP3 file
const getDuration = async (subdirectory, file) => {
  console.log(`Getting duration for file: ${file}`);
  const filePath = path.join(dataDirectoryPath, subdirectory, 'sound', 'sounds', file);

  return new Promise((resolve, reject) => {
    mp3Duration(filePath, (err, duration) => {
      if (err) {
        console.error('Error getting MP3 duration:', err);
        reject(err);
      } else {
        resolve(duration);
      }
    });
  });
};

// Get a list of files in a directory with an optional file suffix filter
const getFileList = async (dir, suffix = '*') => {
  console.log(`Getting file list for ${dir} with suffix: ${suffix}`);
  const dirPath = path.join(__dirname, `../${dir}`);

  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, (err, files) => {
      if (err) {
        console.error('Error getting file list:', err);
        reject(err);
      } else {
        const filteredFiles = suffix === '*' ? files : files.filter(file => file.endsWith(`.${suffix}`));
        resolve(filteredFiles);
      }
    });
  });
};

// Get a list of directories in the data folder
const getFFFList = () => {
  console.log('Getting list of directories in data folder');
  const directories = [];
  const fileList = fs.readdirSync(dataDirectoryPath);

  fileList.forEach((file) => {
    const filePath = path.join(dataDirectoryPath, file);
    if (fs.statSync(filePath).isDirectory() && file !== 'samples') {
      directories.push(file);
    }
  });

  return directories;
};

module.exports = {
  getFile,
  writeFile,
  createDirectory,
  getFileList,
  playSoundFile,
  getDuration,
  deleteFile,
  getFFFList,
  fileExists,
  readScriptData,
  renameFile,
  getSheet,
};
