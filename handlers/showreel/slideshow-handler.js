'use strict';

const { URL } = require('url');
const { getFile, getFileList, getDuration } = require('../../services/file-service');

/**
 * Handles requests related to the slideshow.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const slideshowHandler = async (req, res) => {
  console.info('ENTERING SLIDESHOW HANDLER');

  try {
    // Extract query parameters from the request URL
    const u = new URL(req.originalUrl, `http://${req.headers.host}`);
    const title = u.searchParams.get('title');
    let sceneNumber = parseInt(u.searchParams.get('sceneNumber'), 10) || 0;
    let elementNumber = parseInt(u.searchParams.get('elementNumber'), 10) || 0;

    // Validate the 'title' parameter
    if (!title) {
      console.error('Title is required');
      res.status(400).send('Title is required');
      return;
    }

    // Retrieve script data from the filmFoxFile
    const filmFoxFile = await getFile(`${title}/${title}.fff`);
    if (!filmFoxFile) {
      console.error('Film file not found');
      res.status(404).send('Film file not found');
      return;
    }
    const { script } = filmFoxFile;

    // Validate and adjust sceneNumber and elementNumber to be within valid ranges
    sceneNumber = Math.max(0, Math.min(sceneNumber, script.length - 1));
    elementNumber = Math.max(0, Math.min(elementNumber, script[sceneNumber].length - 1));

    // Retrieve information for the current scene and element
    const element = script[sceneNumber][elementNumber];
    const slug = script[sceneNumber][0].dialogue;  // Assuming first element's dialogue is the slug

    // Initialize audio-related variables
    const fileName = `${sceneNumber.toString().padStart(4, '0')}_${elementNumber.toString().padStart(4, '0')}.mp3`;
    const audioPath = `../data/${title}/sound/sounds/${fileName}`;

    // Check if the current scene's sound file exists
    const soundsList = await getFileList(`data/${title}/sound/sounds`, 'mp3');
    const audio = soundsList.includes(fileName) ? audioPath : '';
    const audioLength = audio ? await getDuration(title, fileName) * 1000 : 0;

    // Render the slideshow template with relevant data
    res.render('showreel/slideshow.njk', {
      sceneNumber,
      elementNumber,
      highestElement: script[sceneNumber].length - 1,
      highestScene: script.length - 1,
      title,
      element,
      slug,
      page: 'Slideshow',
      caller: 'slideshow',
      audio,
      audioLength,
    });
  } catch (error) {
    console.error('Error in slideshowHandler:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { slideshowHandler };
