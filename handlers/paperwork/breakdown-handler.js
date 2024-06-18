'use strict';

const url = require('url');
const { getFile, writeFile } = require('../../services/file-service');

/**
 * Handles requests related to the breakdown of scenes.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const breakdownHandler = async (req, res) => {
  try {
    // Logging entering the handler
    console.log('ENTERING BREAKDOWN HANDLER');

    // Parsing URL parameters
    const parsedUrl = url.parse(req.originalUrl, true);
    let sceneNumber = parsedUrl.query.sceneNumber || 1;
    let elementNumber = parsedUrl.query.elementNumber || 0;
    const title = parsedUrl.query.title;
    let element = parsedUrl.query.element;
    const hidden = parsedUrl.query.hidden;
    let entity = parsedUrl.query.entity;
    let action = parsedUrl.query.action;

    if (sceneNumber < 1 ) sceneNumber = 1;

    // Loading filmFoxFile data
    const filmFoxFile = await getFile(`${title}/${title}.fff`);
    let { script, breakdown } = filmFoxFile;

    // Initializing categories array
    const categories = breakdown[0].map(c => c[0]);

    // Defaulting sceneNumber and elementNumber if not provided
    if (!entity) {
      action = 'display';
    } else {
      entity = entity.toUpperCase().trim();
    }

    // Handling 'add' action
    if (action === 'add') {
      let elementExists = false;
      breakdown[sceneNumber].forEach(b => {
        if (b[0] === element) {
          if (b.indexOf(entity) === -1) {
            b.push(entity);
          }
          elementExists = true;
        }
      });
      if (!elementExists) {
        breakdown[sceneNumber].push([element, entity]);
      }
    }

    // Handling 'del' action
    if (action === 'del') {
      element = element.replace(/-/g, ' ');
      for (let i = 0; i < breakdown[sceneNumber].length; i++) {
        if (breakdown[sceneNumber][i][0] === element) { 
          let temp = breakdown[sceneNumber][i].filter(value => value !== entity);
          breakdown[sceneNumber][i] = temp;
        }
      }
    }

    // Writing the updated filmFoxFile back to the file if needed
    if (action !== 'display') {
      await writeFile(JSON.stringify(filmFoxFile), `${title}/${title}.fff`);
    }


    // Generating headers based on the breakdown data
    const headers = breakdown[sceneNumber]
      .filter(b => b !== null)
      .map(b => b[0].replace(/ /gi, '-'));

    // Generating elementNames based on the breakdown data
    const elementNames = breakdown[sceneNumber].map(b => b[0].replace(/ /gi, '-'));

    // Rendering the 'breakdown' template with provided data
    res.render('paperwork/breakdown.njk', {
      title,
      sceneNumber,
      elementNumber,
      highestScene: script.length - 1,
      breakdown: breakdown[sceneNumber],
      categories,
      scene: script[sceneNumber],
      headers,
      hidden,
      page: 'Scene Breakdown',
      caller: 'breakdown',
      elementNames,
    });
  } catch (error) {
    // Handling errors and sending a 500 Internal Server Error response
    console.error(`Error in breakdownHandler: ${error}`);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { breakdownHandler };
