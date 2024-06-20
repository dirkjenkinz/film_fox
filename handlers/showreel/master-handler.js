'use strict';

const url = require('url');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

// Handler for the master sound processing
const masterHandler = async (req, res) => {
  console.log('ENTERING MASTER HANDLER');

  try {
    // Parse query parameters from the request URL
    const u = new URL(req.originalUrl, `http://${req.headers.host}`);
    const title = u.searchParams.get('title');
    const size = parseInt(u.searchParams.get('size'), 10);
    const sceneNumber = parseInt(u.searchParams.get('sceneNumber'), 10);
    const dirPath = path.join(__dirname, `../../data/${title}/sound/scenes`);

    // Validate input parameters
    if (!title || isNaN(size) || isNaN(sceneNumber) || size <= 0 || sceneNumber < 0) {
      console.error('Invalid input parameters.');
      res.status(400).send('Invalid input parameters');
      return;
    }

    // Create a new instance of ffmpeg for concatenation
    const concat = ffmpeg();
    // Iterate through the sound scenes and add them to the concatenation
    for (let i = 0; i < size; i++) {
      let fileName = `s${i.toString().padStart(5, '0')}.mp3`;
      concat.input(`${dirPath}/${fileName}`);
    }

    // Perform concatenation and handle events
    concat
      .on('end', () => {
        console.log('Concatenation finished.');
        res.redirect(`/sound?title=${title}&sceneNumber=${sceneNumber}`);
      })
      .on('error', (err) => {
        console.error(`Error during concatenation: ${err}`);
        res.status(500).send('Internal Server Error');
      })
      .mergeToFile(`${dirPath}/master.mp3`, dirPath);
  } catch (error) {
    console.error(`Error in masterHandler: ${error}`);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { masterHandler };
