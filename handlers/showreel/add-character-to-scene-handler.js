'use strict';

const url = require('url');
const { getFile, writeFile } = require('../../services/file-service');

/**
 * Handles the addition of a character to a specific scene.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const addCharacterToSceneHandler = async (req, res) => {
  try {
    console.log('ENTERING ADD CHARACTER TO SCENE HANDLER');

    const { query } = url.parse(req.originalUrl, true);
    const { title, character, sceneNumber: sceneNumberStr, elementNumber: elementNumberStr } = query;

    if (!title || !character || !sceneNumberStr || !elementNumberStr) {
      res.status(400).send('Missing required parameters');
      return;
    }

    const sceneNumber = parseInt(sceneNumberStr, 10);
    const elementNumber = parseInt(elementNumberStr, 10);

    const filmFoxFile = await getFile(`${title}/${title}.fff`);
    if (!filmFoxFile.charactersByScene || !Array.isArray(filmFoxFile.charactersByScene[sceneNumber])) {
      res.status(404).send('Scene not found');
      return;
    }

    // Prevent duplicate characters in the scene
    if (!filmFoxFile.charactersByScene[sceneNumber].includes(character)) {
      filmFoxFile.charactersByScene[sceneNumber].push(character);
      await writeFile(JSON.stringify(filmFoxFile), `${title}/${title}.fff`);
      res.redirect(`/showreel?title=${title}&sceneNumber=${sceneNumber}&elementNumber=${elementNumber}`);
    } else {
      res.status(409).send('Character already exists in the scene');
    }
  } catch (error) {
    console.error(`Error in addCharacterToSceneHandler: ${error}`);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { addCharacterToSceneHandler };
