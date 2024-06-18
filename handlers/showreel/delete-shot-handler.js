'use strict';

const { URL } = require('url'); // Using the modern URL API
const { getFile, writeFile } = require('../../services/file-service');

// Handler for deleting a shot from the shot list
const deleteShotHandler = async (req, res) => {
  console.log('ENTERING DELETE SHOT HANDLER');

  try {
    const urlObj = new URL(req.originalUrl, `http://${req.headers.host}`);
    const title = urlObj.searchParams.get('title');
    const sceneNumber = parseInt(urlObj.searchParams.get('sceneNumber'), 10);
    const elementNumber = parseInt(urlObj.searchParams.get('elementNumber'), 10);
    const shotIndex = parseInt(urlObj.searchParams.get('line'), 10); // Correctly parsed as integer

    if (!title || isNaN(sceneNumber) || isNaN(elementNumber) || isNaN(shotIndex)) {
      res.status(400).send('Invalid or missing parameters');
      return;
    }

    const filmFoxFile = await getFile(`${title}/${title}.fff`);
    if (!filmFoxFile.shotList || !filmFoxFile.shotList[sceneNumber]) {
      res.status(404).send('Scene or shot list not found');
      return;
    }

    const shots = filmFoxFile.shotList[sceneNumber].lines || [];
    if (shotIndex < 0 || shotIndex >= shots.length) {
      res.status(404).send('Shot index out of bounds');
      return;
    }

    // Perform the deletion
    shots.splice(shotIndex, 1);

    await writeFile(JSON.stringify(filmFoxFile), `${title}/${title}.fff`);

    res.redirect(`/scene-shot-list?title=${title}&sceneNumber=${sceneNumber}&elementNumber=${elementNumber}`);
  } catch (error) {
    console.error(`Error deleting shot: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { deleteShotHandler };
