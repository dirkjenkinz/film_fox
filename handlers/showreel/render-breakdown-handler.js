'use strict';

const { URL } = require('url'); // Import URL class to handle URL parsing
const { getFile } = require('../../services/file-service');

// Handler for rendering a scene breakdown
const renderBreakdownHandler = async (req, res) => {
  console.info('ENTERING RENDER BREAKDOWN HANDLER');

  try {
    // Parse query parameters from the request URL
    const u = new URL(req.originalUrl, `http://${req.headers.host}`);
    const title = u.searchParams.get('title');
    const sceneNumber = parseInt(u.searchParams.get('sceneNumber'), 10);
    const elementNumber = parseInt(u.searchParams.get('elementNumber'), 10);

    // Validate input parameters
    if (!title || isNaN(sceneNumber) || isNaN(elementNumber)) {
      console.error('Invalid input parameters', { title, sceneNumber, elementNumber });
      res.status(400).send('Invalid input parameters');
      return;
    }

    // Fetch the script file for the given title
    const filmFoxFile = await getFile(`${title}/${title}.fff`);
    if (!filmFoxFile) {
      console.error('Film file not found');
      res.status(404).send('Film file not found');
      return;
    }

    let { script } = filmFoxFile;
    let breakdownData = [];

    // Check if the specified scene number is within the script array bounds
    if (sceneNumber >= script.length) {
      console.error('Scene number out of bounds');
      res.status(404).send('Scene number out of bounds');
      return;
    }

    // Extract relevant breakdown data from the script for the specified scene
    script[sceneNumber].forEach((s) => {
      breakdownData.push({ character: s.character, dialogue: s.dialogue });
    });

    // Render the 'breakdown' template with relevant data
    res.render('breakdown.njk', {
      doc: breakdownData,
      title,
      sceneNumber,
      elementNumber,
      page: 'Breakdown',
      caller: 'breakdown',
    });
  } catch (error) {
    console.error('Error in renderBreakdownHandler:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { renderBreakdownHandler };
