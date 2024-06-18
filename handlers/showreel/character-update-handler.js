'use strict';

const url = require('url');
const { getFile, writeFile } = require('../../services/file-service');

/**
 * Function to transform voice data.
 * @param {Array} voices - Array of voice data objects.
 * @returns {Array} - Transformed and sorted voice data.
 */
const getVoiceData = (voices) => {
  return voices.map(voice => [
    voice.name,
    voice.description,
    voice.voice_id
  ]).sort((a, b) => a[0].localeCompare(b[0])); // Assuming sorting by name
};

/**
 * Handler function for character update.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const characterUpdateHandler = async (req, res) => {
  try {
    console.log('ENTERING CHARACTER UPDATE HANDLER');

    const { query } = url.parse(req.originalUrl, true);
    const { voice, character, sceneNumber, elementNumber, title } = query;

    if (!voice || !character || !title) {
      res.status(400).send('Missing required parameters');
      return;
    }

    const filmFoxFile = await getFile(`${title}/${title}.fff`);
    const characters = filmFoxFile.characterList;
    let isUpdated = false;

    characters.forEach(c => {
      if (c[0] === character && c[1] !== voice) {
        c[1] = voice;
        isUpdated = true;
      }
    });

    if (isUpdated) {
      await writeFile(JSON.stringify(filmFoxFile), `${title}/${title}.fff`);
    }

    res.redirect(`/ctv?title=${title}&sceneNumber=${sceneNumber}&elementNumber=${elementNumber}`);
  } catch (error) {
    console.error('Error in characterUpdateHandler:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { characterUpdateHandler };
