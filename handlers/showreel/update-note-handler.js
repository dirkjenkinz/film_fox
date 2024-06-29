'use strict';

const url = require('url');
const { getFile, writeFile } = require('../../services/file-service');

/**
 * Handles requests to update a note.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const updateNoteHandler = async (req, res) => {
  try {
    console.log('ENTERING UPDATE NOTE HANDLER');

    // Parse URL parameters
    const parsedUrl = new URL(req.originalUrl, `http://${req.headers.host}`);
    const title = parsedUrl.searchParams.get('title');
    const sceneNumber = parsedUrl.searchParams.get('sceneNumber');
    const elementNumber = parsedUrl.searchParams.get('elementNumber');
    const val = parsedUrl.searchParams.get('val');
    const caller = parsedUrl.searchParams.get('caller');

    // Retrieve filmFoxFile and shotList from the file
    const filmFoxFile = await getFile(`${title}/${title}.fff`);
    const { shotList } = filmFoxFile;

    // Update the note in the shotList
    shotList[sceneNumber].note = val;

    // Write the updated filmFoxFile back to the file system
    await writeFile(JSON.stringify(filmFoxFile), `${title}/${title}.fff`);

    // Redirect based on the caller
    let redirectUrl = `/showreel?title=${title}&sceneNumber=${sceneNumber}&elementNumber=${elementNumber}&speak=yes`;
    if (caller === 'scenes') {
      redirectUrl = `/scenes?title=${title}`;
    } else if (caller === 'shot-list') {
      redirectUrl = `/scene-shot-list?title=${title}&sceneNumber=${sceneNumber}`;
    }
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Error in updateNoteHandler:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { updateNoteHandler };
