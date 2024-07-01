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
    const title = parsedUrl.query.title;
    const sceneNumber = parsedUrl.query.sceneNumber;
    const elementNumber = parsedUrl.query.elementNumber;
    const category = parsedUrl.query.category;
    const caller = parsedUrl.query.caller;

    // Fetch movie file information asynchronously
    const filmFoxFile = await getFile(`${title}/${title}.fff`);

    // Ensure breakdown property exists or initialize it as an empty array
    filmFoxFile.breakdown = filmFoxFile.breakdown || [];

    // Filter out the specified category from each breakdown entry
    filmFoxFile.breakdown = filmFoxFile.breakdown.map(categories => {
      return categories.filter(categoryItem => categoryItem[0] !== category);
    });

    // Write the updated file content back to the file
    await writeFile(JSON.stringify(filmFoxFile), `${title}/${title}.fff`);

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
