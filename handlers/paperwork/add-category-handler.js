'use strict';

const url = require('url');
const { getFile, writeFile } = require('../../services/file-service');

/**
 * Handles the addition of a category to the breakdown data.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const addCategoryHandler = async (req, res) => {
  try {
    // Logging entry into the handler for traceability
    console.log('ENTERING ADD CATEGORY HANDLER');

    // Parsing URL parameters
    const parsedUrl = url.parse(req.originalUrl, true);
    const { title, sceneNumber, elementNumber, category, caller } = parsedUrl.query;

    // Validate required query parameters
    if (!title || !sceneNumber || !elementNumber || !category || !caller) {
      return res.status(400).send('Bad Request: Missing required query parameters');
    }

    // Retrieving filmFoxFile data
    const filmFoxFile = await getFile(`${title}/${title}.fff`);
    if (!filmFoxFile) {
      return res.status(404).send('Not Found: Film file does not exist');
    }

    let { breakdown } = filmFoxFile;

    if (!Array.isArray(breakdown) || !breakdown.length) {
      return res.status(400).send('Bad Request: Breakdown data is invalid or empty');
    }

    // Check if the category already exists in the first breakdown entry
    let categoryExists = false;
    breakdown[0].forEach((b) => {
      if (b[0] === category) {
        categoryExists = true;
      }
    });

    // Add the new category to each breakdown entry if it does not already exist
    if (!categoryExists) {
      breakdown = breakdown.map((b) => [...b, [category]]);
      filmFoxFile.breakdown = breakdown;

      // Writing the updated filmFoxFile back to the file
      await writeFile(JSON.stringify(filmFoxFile), `${title}/${title}.fff`);
    }

    // Redirecting based on the caller parameter
    if (caller === 'showreel') {
      res.redirect(`/showreel?title=${title}&elementNumber=${elementNumber}&sceneNumber=${sceneNumber}`);
    } else {
      res.redirect(`/categories?title=${title}&elementNumber=${elementNumber}&sceneNumber=${sceneNumber}`);
    }
  } catch (error) {
    // Logging errors and sending a 500 Internal Server Error response
    console.error(`Error in addCategoryHandler: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { addCategoryHandler };
