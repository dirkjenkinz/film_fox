'use strict';

const url = require('url');
const { getFile, writeFile } = require('../../services/file-service');

/**
 * Handles the addition of a character to the non-speakers list.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const addCharacterHandler = async (req, res) => {
  try {
    console.log('ENTERING ADD CHARACTER HANDLER');

    const { query } = url.parse(req.originalUrl, true);
    const { title, character, sceneNumber, elementNumber } = query;

    if (!title || !character || !sceneNumber || !elementNumber) {
      res.status(400).send('Missing required parameters');
      return;
    }

    const parsedSceneNumber = parseInt(sceneNumber, 10);
    const parsedElementNumber = parseInt(elementNumber, 10);

    const filmFoxFile = await getFile(`${title}/${title}.fff`);
    if (!filmFoxFile.nonSpeakers) {
      filmFoxFile.nonSpeakers = [];
    }

    if (!filmFoxFile.nonSpeakers.includes(character)) {
      filmFoxFile.nonSpeakers.push(character);
    }

    await writeFile(JSON.stringify(filmFoxFile), `${title}/${title}.fff`);

    res.redirect(`/characters?title=${title}&elementNumber=${parsedElementNumber}&sceneNumber=${parsedSceneNumber}`);
  } catch (error) {
    console.error(`Error in addCharacterHandler: ${error}`);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { addCharacterHandler };
