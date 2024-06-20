'use strict';

// Import required modules
const url = require('url');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const { getFileList } = require('../../services/file-service');

/**
 * Concatenates audio clips for a specific scene.
 * @param {Array} clips - List of audio clips to concatenate.
 * @param {string} sceneNumber - Scene number.
 * @param {string} title - Title of the film.
 * @returns {Promise} - Promise that resolves when concatenation is complete.
 */
const concatFiles = (clips, sceneNumber, title) => {
  return new Promise((resolve, reject) => {
    console.log(`Concatenating scene ${sceneNumber}`);

    const fileName = `s0${sceneNumber}.mp3`;
    const outPath = path.join(__dirname, `../../data/${title}/sound/scenes`);
    const dirPath = path.join(__dirname, `../../data/${title}/sound/sounds`);

    const concat = ffmpeg();

    clips.forEach((clip) => {
      concat.input(path.join(dirPath, clip));
    });

    const blank = path.join(__dirname, '../../blank.mp3');
    concat.input(blank);

    concat.on('end', () => {
      console.log('Concatenation finished.');
      resolve();
    }).on('error', (err) => {
      console.error(`Concatenation failed: ${err.message}`);
      reject(err);
    }).mergeToFile(path.join(outPath, fileName), outPath);
  });
};

/**
 * Request handler for sound concatenation.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
const concatenateSoundHandler = async (req, res) => {
  try {
    console.log('ENTERING CONCATENATE SOUND HANDLER');

    const u = url.parse(req.originalUrl, true);
    const title = u.query.title;
    const sceneNumber = u.query.sceneNumber;
    const elementNumber = u.query.elementNumber;

    const sc = sceneNumber.padStart(4, '0');
    const mxx = await getFileList(`data/${title}/sound/sounds/`, 'mp3');

const mp3List = [];
    mxx.forEach((mp3) => {
      if (mp3.length === 13){
        mp3List.push(mp3);
      }
    });

console.log({mp3List});

    const comp = mp3List.filter((m) => m.startsWith(sc));

    console.log({comp});

    await concatFiles(comp, sc, title);

    res.redirect(`/sound?title=${title}&elementNumber=${elementNumber}&sceneNumber=${sceneNumber}`);
  } catch (error) {
    console.error(`Error in concatenateSoundHandler: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
};

// Export the handler function
module.exports = { concatenateSoundHandler };
