'use strict';

const { URL } = require('url'); // Use modern URL API

const { deleteFile } = require('../../services/file-service');

// Handler for deleting an image
const deleteImageHandler = async (req, res) => {
  console.log('ENTERING DELETE IMAGE HANDLER');

  try {
    // Using WHATWG URL API for more robust URL parsing
    const urlObj = new URL(req.originalUrl, `http://${req.headers.host}`);
    const title = urlObj.searchParams.get('title');
    const sceneNumber = urlObj.searchParams.get('sceneNumber');
    const elementNumber = urlObj.searchParams.get('elementNumber');
    const imageName = urlObj.searchParams.get('image');

    if (!title || !imageName) {
      res.status(400).send('Missing required parameters: title or image name');
      return;
    }

    // Construct the path more securely
    const filePath = `${title}/vision/images/${imageName}`;
    if (filePath.includes('../')) {
      // Prevent directory traversal attacks
      res.status(400).send('Invalid file path');
      return;
    }

    await deleteFile(filePath);

    res.redirect(`/show-gallery?title=${title}&elementNumber=${elementNumber}&sceneNumber=${sceneNumber}`);
  } catch (error) {
    console.error(`Error deleting image: ${error.message}, Title: ${title}, Image: ${imageName}`);
    res.status(500).send('Internal Server Error');
  }
};

// Export the deleteImageHandler function for use in other modules
module.exports = { deleteImageHandler };
