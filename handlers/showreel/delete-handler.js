'use strict';

const { URL } = require('url'); // Use modern URL API
const { deleteFile } = require('../../services/file-service');

// Handler for deleting a file (sound or other types)
const deleteHandler = async (req, res) => {
  console.log('ENTERING DELETE HANDLER');

  try {
    // Using WHATWG URL API for more robust URL parsing
    const urlObj = new URL(req.originalUrl, `http://${req.headers.host}`);
    const title = urlObj.searchParams.get('title');
    const sceneNumber = urlObj.searchParams.get('sceneNumber');
    const elementNumber = urlObj.searchParams.get('elementNumber');
    const soundName = urlObj.searchParams.get('fileName');

    if (!title || !soundName) {
      res.status(400).send('Missing required parameters: title or file name');
      return;
    }

    // Construct the path more securely
    const filePath = `${title}/sound/sounds/${soundName}`;
    if (filePath.includes('../')) {
      // Prevent directory traversal attacks
      res.status(400).send('Invalid file path');
      return;
    }

    await deleteFile(filePath);

    res.redirect(`/showreel?title=${title}&sceneNumber=${sceneNumber}&elementNumber=${elementNumber}`);
  } catch (error) {
    console.error(`Error deleting file: ${error.message}, Title: ${title}, Sound Name: ${soundName}`);
    res.status(500).send('Internal Server Error');
  }
};

// Export the deleteHandler function for use in other modules
module.exports = { deleteHandler };
