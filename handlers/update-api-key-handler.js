'use strict';

// Import necessary modules
const { URL } = require('url');
const { getFile, writeFile } = require('../services/file-service');

/**
 * Handles updating the API key in the control.json file.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const updateAPIKeyHandler = async (req, res) => {
  console.info('ENTERING UPDATE API KEY HANDLER');

  try {
    // Parse the URL to extract query parameters using the URL constructor for better practices
    const parsedURL = new URL(req.originalUrl, `http://${req.headers.host}`);

    // Validate query parameters
    const newAPIKey = parsedURL.searchParams.get('key');
    if (!newAPIKey) {
      console.error('Invalid or missing API key');
      res.status(400).send('Invalid or missing API key');
      return;
    }

    // Read control.json file to get current control data
    const control = await getFile('control.json');
    if (!control) {
      console.error('Failed to load control settings');
      res.status(404).send('Control settings not found');
      return;
    }

    // Update the API key in the control data with the new key
    control.apiKey = newAPIKey;

    // Write the updated control data back to control.json
    await writeFile(JSON.stringify(control), 'control.json');

    // Redirect to the front page after successful update
    res.redirect('/front');
  } catch (error) {
    console.error('Error in updateAPIKeyHandler:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Export the updateAPIKeyHandler function for external use
module.exports = { updateAPIKeyHandler };
