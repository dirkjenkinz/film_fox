'use strict';

const { URL } = require('url');
const { playSoundFile } = require('../../services/file-service');

// Handler for playing the master sound file
const playMasterHandler = async (req, res) => {
  console.log('ENTERING PLAY MASTER HANDLER');

  try {
    // Parse query parameters from the request URL
    const u = new URL(req.originalUrl, `http://${req.headers.host}`);
    const sceneNumber = parseInt(u.searchParams.get('sceneNumber'), 10);
    const title = u.searchParams.get('title');

    // Validate input parameters
    if (isNaN(sceneNumber) || sceneNumber < 0 || !title) {
      console.error('Invalid input parameters: ', { sceneNumber, title });
      res.status(400).send('Invalid input parameters');
      return;
    }

    // Play the master audio file
    const playbackResult = await playSoundFile(title, 'master.mp3', 'sound/scenes');
    if (!playbackResult) {
      console.error('Failed to play the sound file.');
      res.status(404).send('Sound file not found');
      return;
    }

    // Redirect to the /sound page after a delay
    setTimeout(() => {
      res.redirect(`/sound?title=${title}&sceneNumber=${sceneNumber}`);
    }, 5000);
  } catch (error) {
    console.error('Error in playMasterHandler:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { playMasterHandler };
