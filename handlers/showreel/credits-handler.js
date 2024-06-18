'use strict';

const { URL } = require('url');
const { getFile } = require('../../services/file-service');

// Define the creditsHandler function to handle requests related to movie credits
const creditsHandler = async (req, res) => {
  try {
    console.log('ENTERING CREDITS HANDLER');

    // Use WHATWG URL API for parsing query parameters safely
    const urlObj = new URL(req.originalUrl, `http://${req.headers.host}`);
    const title = urlObj.searchParams.get('title');
    const sceneNumber = urlObj.searchParams.get('sceneNumber');
    const elementNumber = urlObj.searchParams.get('elementNumber');

    // Validate required parameters
    if (!title) {
      res.status(400).send('Title parameter is required');
      return;
    }

    // Fetch movie file information asynchronously and safely
    const safeTitle = title.replace(/[^a-zA-Z0-9_-]/g, ''); // Basic sanitization
    const filmFoxFile = await getFile(`${safeTitle}/${safeTitle}.fff`);

    // Check if credits object exists, if not use default values
    const credits = filmFoxFile.credits || { title: safeTitle, director: 'Unknown', writer: 'Unknown', producer: 'Unknown' };

    // Render the 'credits' template with relevant data
    res.render('paperwork/credits.njk', {
      title: safeTitle,
      credits,
      page: 'Credits',
      caller: 'credits',
      sceneNumber,
      elementNumber,
    });
  } catch (error) {
    console.error(`Error in creditsHandler: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
};

// Export the creditsHandler function for use in other modules
module.exports = { creditsHandler };
