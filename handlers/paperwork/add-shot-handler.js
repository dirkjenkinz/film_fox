'use strict';

const url = require('url');
const { getFile, writeFile } = require('../../services/file-service');

/**
 * Handles the addition of a new shot to a specific scene.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const addShotHandler = async (req, res) => {
  try {
    // Logging entering the handler
    console.log('ENTERING ADD SHOT HANDLER');

    // Parsing URL parameters
    const u = url.parse(req.originalUrl, true);
    const { title, sceneNumber, elementNumber, line } = u.query;

    // Retrieving filmFoxFile data
    const filmFoxFile = await getFile(`${title}/${title}.fff`);
    const { shotList } = filmFoxFile;

    // Creating a new shot with default values
    const newLine = {
      shot: '-',
      angle: '-',
      move: '-',
      audio: '-',
      subject: '',
      description: ''
    };

    // Inserting the new shot at the specified position
    shotList[sceneNumber].lines.splice(parseInt(line) + 1, 0, newLine);

    // Writing the updated filmFoxFile back to the file
    await writeFile(JSON.stringify(filmFoxFile), `${title}/${title}.fff`);

    // Redirecting to the scene-shot-list page with updated parameters
    res.redirect(`/scene-shot-list?title=${title}&sceneNumber=${sceneNumber}&elementNumber=${elementNumber}`);
  } catch (error) {
    // Handling errors and sending a 500 Internal Server Error response
    console.error(`Error in addShotHandler: ${error}`);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { addShotHandler };