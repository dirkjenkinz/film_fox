'use strict';

const url = require('url');
const { getFile, getFileList } = require('../../services/file-service');

// Constants for shot, angles, moves, and audio options
const shotTypes = ['-', 'WS', 'VWS', 'MS', 'MCU', 'XCU', 'CU'];
const angles = [
  '-',
  'Eye Level',
  'High Angle',
  'Low Angle',
  'Dutch Angle/Tilt',
  'Over The Shoulder',
  'Birds-Eye View',
  'Point of View',
];
const moves = [
  '-',
  'Static',
  'Pan',
  'Tilt',
  'Dolly',
  'Crane/Boom',
  'Handheld',
  'Zoom',
  'Rack Focus',
];
const audioTypes = ['-', 'Boom', 'Lavs', 'Lavs and Boom', 'Voice Over (VO)'];

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

    const size = shotList.length - 1;
    const slug = script[sceneNumber][0].dialogue;

    const categories = [];

    breakdown[sceneNumber].forEach((category) => {
      if (category.length === 1){
        category.push['empty'];
      }
      categories.push(category);
    });

    const used = breakdown[0].map(b => [b[0], 'n']);

    // Create a list to store scenes and their associated categories
    const list = breakdown.reduce((acc, used, index) => {
      const temp = [index];
      used.forEach((c) => {
        if (c.length > 1) {
          temp.push(c);
        }
      });
      if (temp.length > 1) {
        acc.push(temp);
      }
      return acc;
    }, []);

    // Update used array based on the scenes and their associated categories
    list.forEach((scene) => {
      scene.forEach((s) => {
        used.forEach((c) => {
          if (c[0] === s[0]) {
            c[1] = 'y';
          }
        });
      });
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
      categories,
      lines: shotList[sceneNumber].lines,
      shots,
      shotTypes,
      audioTypes,
      angles,
      moves,
      audio,
      note: shotList[sceneNumber].note,
      slug,
      size,
      used,
    });
  } catch (error) {
    console.error(`Error in Showreel Handler: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { showreelHandler };
