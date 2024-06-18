'use strict';

const { URL } = require('url'); // Use destructuring for importing URL
const { getFile } = require('../../services/file-service');
const { generateSample } = require('../../services/elevenLabs');

// Handler for generating voice samples
const getSamplesHandler = async (req, res) => {
  console.info('ENTERING GET SAMPLES HANDLER');

  try {
    // Parse query parameters from the request URL
    const u = new URL(req.originalUrl, `http://${req.headers.host}`);
    const voiceId = u.searchParams.get('voice_id');

    if (!voiceId) {
      console.error('Missing voice_id parameter');
      res.status(400).send('Missing required parameter: voice_id');
      return;
    }

    // Fetch necessary data from files
    const controlData = await getFile('control.json');
    if (!controlData) {
      console.error('Control file not found');
      res.status(404).send('Control file not found');
      return;
    }
    const { api_key } = controlData;

    // Generate a voice sample asynchronously using the ElevenLabs service
    const sampleResult = await generateSample(voiceId, api_key);
    if (sampleResult !== 'Success') {
      console.error('Sample generation failed', sampleResult);
      res.status(500).send('Failed to generate voice sample');
      return;
    }

    // Redirect to the 'voices' page after a delay (e.g., 3000 milliseconds)
    setTimeout(() => {
      res.redirect('/voices');
    }, 3000);
  } catch (error) {
    console.error(`Error generating voice sample: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
};

// Export the getSamplesHandler function for use in other modules
module.exports = { getSamplesHandler };
