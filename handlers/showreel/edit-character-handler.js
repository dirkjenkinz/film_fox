'use strict';

const { URL } = require('url'); // Use modern URL API
const { getFile, getFileList } = require('../../services/file-service');

const editCharacterHandler = async (req, res) => {
  console.info('ENTERING EDIT CHARACTER HANDLER');

  try {
    const urlObj = new URL(req.originalUrl, `http://${req.headers.host}`);
    const title = urlObj.searchParams.get('title');
    const character = urlObj.searchParams.get('character');
    const sceneNumber = parseInt(urlObj.searchParams.get('sceneNumber'), 10);
    const elementNumber = parseInt(urlObj.searchParams.get('elementNumber'), 10);
    const msg = urlObj.searchParams.get('msg');

    if (!title || !character) {
      res.status(400).send('Missing or invalid parameters');
      return;
    }

    const filmFoxFile = await getFile(`${title}/${title}.fff`);
    if (!filmFoxFile) {
      console.error('File not found');
      res.status(404).send('File not found');
      return;
    }

    const { characterList, script } = filmFoxFile;
    const elements = [];

    script.forEach((scene, sceneIndex) => {
      scene.forEach((element, elementIndex) => {
        if (element.character === character) {
          const fileName = `${sceneIndex.toString().padStart(4, '0')}_${elementIndex.toString().padStart(4, '0')}.mp3`;
          elements.push({
            sceneNumber: sceneIndex,
            dialogue: element.dialogue,
            elementNumber: elementIndex,
            voice: element.voice,
            sound: fileName
          });
        }
      });
    });

    const soundFiles = await getFileList(`data/${title}/sound/sounds`, 'mp3');
    elements.forEach(element => {
      element.soundExists = soundFiles.includes(element.sound);
    });

    const currentVoice = characterList.find(c => c[0] === character)?.[1] || '';

    res.render('showreel/edit-character.njk', {
      title,
      character,
      elements,
      currentVoice,
      msg,
      sceneNumber,
      elementNumber,
      page: 'Edit Character',
      caller: 'edit-character',
    });
  } catch (error) {
    console.error(`Error editing character: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { editCharacterHandler };
