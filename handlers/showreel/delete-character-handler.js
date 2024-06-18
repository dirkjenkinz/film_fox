'use strict';

const url = require('url');
const { getFile, writeFile } = require('../../services/file-service');

// Handler for deleting a character
const deleteCharacterHandler = async (req, res) => {
  console.log('ENTERING DELETE CHARACTER HANDLER');

  try {
    const u = url.parse(req.originalUrl, true);
    const title = u.query.title;
    const character = u.query.character;
    const sceneNumber = u.query.sceneNumber;
    const elementNumber = u.query.elementNumber;

    if (!title || !character) {
      res.status(400).send('Missing required parameters');
      return;
    }

    const filmFoxFile = await getFile(`${title}/${title}.fff`);

    // Ensure nonSpeakers property exists and initialize it as an empty array if not
    filmFoxFile.nonSpeakers = filmFoxFile.nonSpeakers || [];

    // Filter out the specified character from the nonSpeakers array
    const index = filmFoxFile.nonSpeakers.indexOf(character);
    if (index === -1) {
      res.status(404).send('Character not found in non-speakers list');
      return;
    }

    // Remove the character from the nonSpeakers array
    filmFoxFile.nonSpeakers.splice(index, 1);

    await writeFile(JSON.stringify(filmFoxFile), `${title}/${title}.fff`);

    res.redirect(`/characters?title=${title}&elementNumber=${elementNumber}&sceneNumber=${sceneNumber}`);
  } catch (error) {
    console.error(`Error handling character deletion: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { deleteCharacterHandler };
