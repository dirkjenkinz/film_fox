'use strict';

const { URL } = require('url');
const { getFile, getFileList } = require('../../services/file-service');

/**
 * Handles requests related to voices.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const voicesHandler = async (req, res) => {
  console.info('ENTERING VOICES HANDLER');

  try {
    // Parse URL parameters using the modern URL API
    const parsedUrl = new URL(req.originalUrl, `http://${req.headers.host}`);
    const title = parsedUrl.searchParams.get('title');
    let elementNumber = parseInt(parsedUrl.searchParams.get('elementNumber'), 10) || 0;
    let sceneNumber = parseInt(parsedUrl.searchParams.get('sceneNumber'), 10) || 0;

    if (!title) {
      console.error('Title parameter is required');
      res.status(400).send('Missing title parameter');
      return;
    }

    // Retrieve voices data and list of generated samples
    const voices = await getFile('voices.json');
    if (!voices) {
      console.error('Voice data file not found');
      res.status(404).send('Voice data file not found');
      return;
    }

    const generatedSet = new Set(await getFileList('data/samples', 'mp3'));

    // Create an array of voice objects with additional properties
    const vox = voices.map(v => ({
      id: v.voice_id,
      name: v.name,
      accent: v.labels.accent,
      description: v.labels.description,
      age: v.labels.age,
      gender: v.labels.gender,
      preview: v.preview_url,
      downloaded: 'no', // Assuming download status needs to be dynamically checked
      generated: generatedSet.has(`${v.voice_id}.mp3`) ? 'yes' : 'no',
    }));

    // Sort the array of voice objects by name
    vox.sort((a, b) => a.name.localeCompare(b.name));

    // Render the voices template
    res.render('showreel/voices.njk', {
      vox,
      page: 'Voices',
      caller: 'voices',
      elementNumber,
      sceneNumber,
      title,
    });
  } catch (error) {
    console.error('Error in voicesHandler:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { voicesHandler };
