'use strict';

const url = require('url');
const { getFile } = require('../../services/file-service');

// Constants for shot, angles, moves, and audio options
const shots = ['-', 'WS', 'VWS', 'MS', 'MCU', 'XCU', 'CU'];
const angles = [
  '-',
  'Eye Level',
  'High Angle',
  'Low Angle',
  'Dutch Angle/Tilt',
  'Over The Shoulder (OTS)',
  'Birds-Eye View',
  'Point of View (POV)',
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
const audio = ['-', 'Boom', 'Lavs', 'Lavs and Boom', 'Voice Over (VO)'];

/**
 * Handles rendering the scene shot list page.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const sceneShotListHandler = async (req, res) => {
  try {
    console.log('ENTERING SCENE SHOT LIST HANDLER');

    // Parse URL parameters
    const u = url.parse(req.originalUrl, true);
    const title = u.query.title;
    let sceneNumber = u.query.sceneNumber;
    const elementNumber = u.query.elementNumber;

    // Get file data
    const filmFoxFile = await getFile(`${title}/${title}.fff`);
    const { script, shotList, charactersByScene } = filmFoxFile;

    // Default to scene 0 if sceneNumber is not provided
    if (!sceneNumber) sceneNumber = 0;

    const size = shotList.length - 1;
    const slug = script[sceneNumber][0].dialogue;

    // Render the scene shot list page with necessary data
    res.render('paperwork/scene-shot-list.njk', {
      title,
      sceneNumber,
      lines: shotList[sceneNumber].lines,
      shots,
      angles,
      moves,
      audio,
      note: shotList[sceneNumber].note,
      slug,
      page: 'Scene Shot List',
      caller: 'scene-shot-list',
      size,
      characterList: charactersByScene[sceneNumber],
      elementNumber,
      scene: script[sceneNumber],
    });
  } catch (error) {
    // Log and handle errors
    console.error(`Error in sceneShotListHandler: ${error}`);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { sceneShotListHandler };
