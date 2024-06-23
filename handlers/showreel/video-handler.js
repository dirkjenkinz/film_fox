'use strict';

const { URL } = require('url');
const { getFile, getFileList } = require('../../services/file-service');

/**
 * Handles requests related to video rendering.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const videoHandler = async (req, res) => {
  console.info('ENTERING VIDEO HANDLER');

  try {
    // Parse URL parameters
    const parsedUrl = new URL(req.originalUrl, `http://${req.headers.host}`);
    const title = parsedUrl.searchParams.get('title');
    let elementNumber = parseInt(parsedUrl.searchParams.get('elementNumber'), 10) || 0;
    let sceneNumber = parseInt(parsedUrl.searchParams.get('sceneNumber'), 10) || 0;

    if (!title) {
      console.error('Title parameter is required');
      res.status(400).send('Missing title parameter');
      return;
    }

    // Retrieve filmFoxFile and script from the file
    const filmFoxFile = await getFile(`${title}/${title}.fff`);
    if (!filmFoxFile) {
      console.error('Film file not found');
      res.status(404).send('Film file not found');
      return;
    }
    const { script } = filmFoxFile;

    // Get the list of videos and scenes
    const videoList = await getFileList(`data/${title}/vision/videos`, 'mov');
    const scenesList = await getFileList(`data/${title}/vision/scenes`, 'mov');
    
    const lengthList = [];

    script.forEach((scene) => {
      lengthList.push(scene.length);
    });

    // Check video completion status for each scene
    const completenessArray = script.map((scene, sceneIndex) => 
      scene.every((_, elementIndex) => 
        videoList.includes(`${sceneIndex.toString().padStart(4, '0')}_${elementIndex.toString().padStart(4, '0')}.mov`))
        ? 'yes' : 'no'
    );

    // Check for missing sound files for each scene
    const soundFiles = await getFileList(`data/${title}/sound/sounds`, 'mp3');
    let missingSoundFiles = new Set();

    script.forEach((scene, i) => {
      scene.forEach((_, j) => {
        const fileName = `${i.toString().padStart(4, '0')}_${j.toString().padStart(4, '0')}.mp3`;
        if (!soundFiles.includes(fileName)) {
          missingSoundFiles.add(i.toString().padStart(4, '0'));
        }
      });
    });

    // Check if each scene video exists
    const existsArray = script.map((_, sceneIndex) => 
      scenesList.includes(`${sceneIndex.toString().padStart(4, '0')}.mov`) ? 'yes' : 'no'
    );

    // Determine overall readiness status
    const readiness = completenessArray.every(status => status === 'yes') ? 'yes' : 'no';

    // Render the video template
    res.render('showreel/video.njk', {
      title,
      script,
      page: 'Video',
      caller: 'video',
      sceneNumber,
      elementNumber,
      completenessArray,
      readiness,
      existsArray,
      lengthList,
    });
  } catch (error) {
    console.error('Error in videoHandler:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { videoHandler };
