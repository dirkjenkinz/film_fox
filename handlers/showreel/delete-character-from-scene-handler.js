'use strict';

const url = require('url');
const { getFile, writeFile } = require('../../services/file-service');

// Handler for deleting a character from a scene
const deleteCharacterFromSceneHandler = async (req, res) => {
  console.log('ENTERING DELETE CHARACTER FROM SCENE HANDLER');

  try {
    const u = url.parse(req.originalUrl, true);
    const title = u.query.title;
    const character = u.query.character;
    const sceneNumber = u.query.sceneNumber;
    const elementNumber = u.query.elementNumber;

    if (!title || !character || !sceneNumber) {
      res.status(400).send('Missing required parameters');
      return;
    }

    const filmFoxFile = await getFile(`${title}/${title}.fff`);

    // Ensure the charactersByScene property exists
    filmFoxFile.charactersByScene = filmFoxFile.charactersByScene || {};
    filmFoxFile.charactersByScene[sceneNumber] = filmFoxFile.charactersByScene[sceneNumber] || [];

    const index = filmFoxFile.charactersByScene[sceneNumber].indexOf(character);

    if (index === -1) {
      res.status(404).send('Character not found in scene');
      return;
    }

    // Remove the character if it exists
    filmFoxFile.charactersByScene[sceneNumber].splice(index, 1);

    await writeFile(JSON.stringify(filmFoxFile), `${title}/${title}.fff`);

    res.redirect(`/showreel?title=${title}&sceneNumber=${sceneNumber}&elementNumber=${elementNumber}`);
  } catch (error) {
    console.error(`Error handling character deletion from scene: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { deleteCharacterFromSceneHandler };
