'use strict';

const url = require('url');
const { getFile, writeFile } = require('../../services/file-service');

/**
 * Handles the deletion of a category.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const deleteCategoryHandler = async (req, res) => {
  try {
    // Log entry point for better traceability
    console.log('ENTERING DELETE CATEGORY HANDLER');

    // Parse query parameters from the request URL
    const parsedUrl = url.parse(req.url, true);
    const { title, sceneNumber, elementNumber, category, caller } = parsedUrl.query;

    if (!title || !sceneNumber || !elementNumber || !category || !caller) {
      return res.status(400).send('Bad Request: Missing required query parameters');
    }

    // Fetch movie file information asynchronously
    const filmFoxFile = await getFile(`${title}/${title}.fff`);

    if (!filmFoxFile) {
      return res.status(404).send('Not Found: Film file does not exist');
    }

    // Ensure breakdown property exists or initialize it as an empty array
    filmFoxFile.breakdown = filmFoxFile.breakdown || [];

    // Filter out the specified category from each breakdown entry
    filmFoxFile.breakdown = filmFoxFile.breakdown.map((categories) =>
      categories.filter((categoryItem) => categoryItem[0] !== category)
    );

    // Write the updated file content back to the file
    await writeFile(JSON.stringify(filmFoxFile), `${title}/${title}.fff`);

    // Redirect based on the caller query parameter
    if (caller === 'showreel') {
      res.redirect(`/showreel?title=${title}&elementNumber=${elementNumber}&sceneNumber=${sceneNumber}`);
    } else {
      res.redirect(`/categories?title=${title}&elementNumber=${elementNumber}&sceneNumber=${sceneNumber}`);
    }
  } catch (error) {
    // Log any errors that occur during file handling
    console.error(`Error handling category deletion: ${error.message}`);

    // Send an internal server error response if an error occurs
    res.status(500).send('Internal Server Error');
  }
};

// Export the deleteCategoryHandler function for use in other modules
module.exports = { deleteCategoryHandler };
