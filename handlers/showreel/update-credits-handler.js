'use strict';

const { URL } = require('url');
const { getFile, writeFile } = require('../../services/file-service');

/**
 * Handles requests to update credits.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const updateCreditsHandler = async (req, res) => {
  console.info('ENTERING UPDATE CREDIT HANDLER');

  try {
    // Parse URL parameters
    const parsedUrl = new URL(req.originalUrl, `http://${req.headers.host}`);
    const title = parsedUrl.searchParams.get('title');
    const val = parsedUrl.searchParams.get('val');
    const credit = parsedUrl.searchParams.get('credit');
    const sceneNumber = parsedUrl.searchParams.get('sceneNumber');
    const elementNumber = parsedUrl.searchParams.get('elementNumber');

    if (!title || !credit || !['title', 'director', 'producer', 'writer'].includes(credit)) {
      console.error('Invalid parameters provided');
      res.status(400).send('Invalid parameters provided');
      return;
    }

    // Retrieve filmFoxFile from the file system
    const filmFoxFile = await getFile(`${title}/${title}.fff`);
    if (!filmFoxFile) {
      console.error('Film file not found');
      res.status(404).send('Film file not found');
      return;
    }

    // Initialize credits if not present in the file
    filmFoxFile.credits = filmFoxFile.credits || {
      title: '',
      director: '',
      writer: '',
      producer: '',
    };

    // Update the appropriate credit field based on the query parameter
    if (val !== null) {
      filmFoxFile.credits[credit] = val;
    }

    // Write the updated filmFoxFile back to the file system
    await writeFile(JSON.stringify(filmFoxFile), `${title}/${title}.fff`);

    // Redirect to the credits page with the appropriate parameters
    res.redirect(`/credits?title=${title}&sceneNumber=${sceneNumber}&elementNumber=${elementNumber}`);
  } catch (error) {
    console.error('Error in updateCreditsHandler:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { updateCreditsHandler };
