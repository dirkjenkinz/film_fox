'use strict';

const { URL } = require('url');
const { getFile, writeFile } = require('../../services/file-service');

/**
 * Handles requests to update image display settings.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const updateImageDisplayHandler = async (req, res) => {
  console.info('ENTERING UPDATE IMAGE DISPLAY HANDLER');

  try {
    // Parse URL parameters
    const parsedUrl = new URL(req.originalUrl, `http://${req.headers.host}`);
    const title = parsedUrl.searchParams.get('title');
    const sceneNumber = parseInt(parsedUrl.searchParams.get('sceneNumber'), 10);
    const elementNumber = parseInt(parsedUrl.searchParams.get('elementNumber'), 10);
    const image = parsedUrl.searchParams.get('image');
    const caller = parsedUrl.searchParams.get('caller');

    if (!title || isNaN(sceneNumber) || isNaN(elementNumber) || !image) {
      console.error('Invalid or missing parameters');
      res.status(400).send('Invalid or missing parameters');
      return;
    }

    // Retrieve filmFoxFile and script from the file
    const filmFoxFile = await getFile(`${title}/${title}.fff`);
    if (!filmFoxFile || !filmFoxFile.script || !filmFoxFile.script[sceneNumber]) {
      console.error('Film file not found or scene data missing');
      res.status(404).send('Film file not found or scene data missing');
      return;
    }
    const { script } = filmFoxFile;

    // Determine the type of the image (still or movie)
    const imageExtension = image.slice(-4).toLowerCase();
    const type = ['.mov', '.mp4', '.avi', '.wmv', '.mkv'].includes(imageExtension) ? 'movie' : 'still';

    // Update the type and image path for the specified element and subsequent same images
    script[sceneNumber].forEach((element, index) => {
      if (index >= elementNumber && element.image === script[sceneNumber][elementNumber].image) {
        element.image = image;
        element.type = type;
      }
    });

    // Write the updated filmFoxFile back to the file system
    await writeFile(JSON.stringify(filmFoxFile), `${title}/${title}.fff`);

    // Redirect based on the caller
    const redirectUrl = (caller === 'scenes') ? `/scenes?title=${title}`
                     : (caller === 'showreel') ? `/showreel?title=${title}&sceneNumber=${sceneNumber}&elementNumber=${elementNumber}`
                     : `/display?title=${title}&sceneNumber=${sceneNumber}&elementNumber=${elementNumber}`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Error in updateImageDisplayHandler:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { updateImageDisplayHandler };
