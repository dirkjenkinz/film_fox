'use strict';

const url = require('url');
const { getFile, getFileList } = require('../../services/file-service');

/**
 * Handles the showreel requests by rendering the showreel page with relevant data.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const showreelHandler = async (req, res) => {
  console.log('ENTERING SHOWREEL HANDLER');

  try {
    const u = new URL(req.originalUrl, `http://${req.headers.host}`);
    const title = u.searchParams.get('title');
    let sceneNumber = parseInt(u.searchParams.get('sceneNumber'), 10) || 0;
    let elementNumber = parseInt(u.searchParams.get('elementNumber'), 10) || 0;

    if (!title) {
      res.status(400).send('Title parameter is required');
      return;
    }

    const filmFoxFile = await getFile(`${title}/${title}.fff`);
    const { script, shotList, charactersByScene, nonSpeakers, characterList, breakdown } = filmFoxFile;

    if (elementNumber === -1) {
      sceneNumber--;
      elementNumber = script[sceneNumber].length - 1;
    }

    // Boundary checks for sceneNumber and elementNumber
    sceneNumber = Math.max(0, Math.min(sceneNumber, script.length - 1));
    elementNumber = Math.max(0, Math.min(elementNumber, script[sceneNumber].length - 1));

    let shots = shotList[sceneNumber].lines;

    shots.forEach((line) => {
      console.log({line})
    });

    if (shots.length < 20){
      for (let i = shots.length; i < 20; i++){
        shots[i] = {
          shot: '',
          angle: '',
          move: '',
          audio: '',
          subject: '',
          description: ''
        };
      };
    };

    const element = script[sceneNumber][elementNumber];
    const voice = element.voice;

    const fileName = `${sceneNumber.toString().padStart(4, '0')}_${elementNumber.toString().padStart(4, '0')}.mp3`;
    const soundsList = await getFileList(`data/${title}/sound/sounds`, 'mp3');

    // Handling audio presence
    const audio = soundsList.includes(fileName) ? `../data/${title}/sound/sounds/${fileName}` : '';
    element.sound = audio ? fileName : '';
    const audioComplete = audio ? 'yes' : 'no';

    // Character handling
    let chars = characterList.filter(c => c[0] !== 'NARRATOR').map(c => c[0]).concat(nonSpeakers);
    charactersByScene[sceneNumber]?.forEach(char => {
      chars = chars.filter(c => c !== char);
    });

    // Render the showreel page with relevant data
    res.render('showreel/showreel.njk', {
      showSlider: 'yes',
      sceneNumber,
      elementNumber,
      title,
      element,
      audio,
      audioComplete,
      characters: chars.sort(),
      characterList: charactersByScene[sceneNumber]?.sort() || [],
      highestElement: script[sceneNumber].length - 1,
      highestScene: script.length - 1,
      slug: script[sceneNumber][0].dialogue,
      note: shotList[sceneNumber].note,
      slugList: script.map(s => s[0].dialogue + '@@'),
      noteList: script.map(s => s.note + '@@'),
      page: 'Showreel',
      caller: 'showreel',
      msg: u.searchParams.get('msg'),
      voice,
      breakdown: breakdown[sceneNumber],
      shots,
    });
  } catch (error) {
    console.error(`Error in Showreel Handler: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { showreelHandler };
