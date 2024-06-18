'use strict';

const { URL } = require('url');
const { getFile, getFileList } = require('../../services/file-service');

/**
 * Retrieves the voice for a given character from the characterList.
 * @param {string} character - The character to find the voice for.
 * @param {Array} characterList - List of characters and their associated voices.
 * @returns {string} - The voice of the character.
 */
const getVoice = (character, characterList) => {
  const entry = characterList.find(entry => entry[0] === character);
  return entry ? entry[1] : '';
};

/**
 * Prepares a list indicating whether each scene is ready.
 * @param {Array} script - List of scenes in the script.
 * @param {Array} soundsList - List of sound files.
 * @returns {Array} - Ready list for each scene.
 */
const prepareReadyList = (script, soundsList) => {
  return script.map((scene, index) => {
    const expectedFiles = scene.length;
    const existingFiles = soundsList.filter(file => file.startsWith(`${index.toString().padStart(4, '0')}_`)).length;
    return existingFiles === expectedFiles ? 'yes' : 'no';
  });
};

/**
 * Handles requests related to sound.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const soundHandler = async (req, res) => {
  console.info('ENTERING SOUND HANDLER');

  try {
    // Parse URL parameters
    const u = new URL(req.originalUrl, `http://${req.headers.host}`);
    const title = u.searchParams.get('title');
    const sceneNumber = parseInt(u.searchParams.get('sceneNumber'), 10) || 0;
    const elementNumber = parseInt(u.searchParams.get('elementNumber'), 10) || 0;

    if (!title) {
      console.error('Title is required');
      res.status(400).send('Title is required');
      return;
    }

    // Retrieve file information from filmFoxFile
    const filmFoxFile = await getFile(`${title}/${title}.fff`);
    if (!filmFoxFile) {
      console.error('Film file not found');
      res.status(404).send('Film file not found');
      return;
    }
    const { script, characterList } = filmFoxFile;

    const mergedList = await getFileList(`data/${title}/sound/scenes`, 'mp3');
    const soundsList = await getFileList(`data/${title}/sound/sounds`, 'mp3');

    const readyList = prepareReadyList(script, soundsList);
    //const readyForMaster = readyList.every(status => status === 'yes') ? 'yes' : 'no';
    const readyForMaster = 'yes';
    const masterExists = mergedList.includes('master.mp3') ? 'yes' : 'no';
    const merged = script.map((_, index) => mergedList.includes(`s${index.toString().padStart(5, '0')}.mp3`) ? 'yes' : 'no');

let soundFiles = await getFileList(`data/${title}/sound/sounds`, 'mp3');
let uncompiledList = [];

    script.forEach((s, i) => {
      s.forEach((element, j) => {
        const sceneIndex = i.toString().padStart(4, '0');
        const elementIndex = j.toString().padStart(4, '0');
        const fileName = `${sceneIndex}_${elementIndex}.mp3`;
  
        if (!soundFiles.includes(fileName)) {
          uncompiledList.push([i, j, element.character, getVoice(element.character, characterList)]);
        }
      });
    });

    let incomplete = [...new Set(uncompiledList.map(item => item[0]))];

    console.log({incomplete});
    console.log({readyList});  

    // Render the sound page with relevant data
    res.render('showreel/sound.njk', {
      title,
      script,
      merged,
      masterExists,
      page: 'Sound',
      caller: 'sound',
      size: script.length,
      readyList,
      elementNumber,
      sceneNumber,
      readyForMaster,
      uncompiledList,
      incomplete,
    });
  } catch (error) {
    console.error('Error in soundHandler:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { soundHandler };
