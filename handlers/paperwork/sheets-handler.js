'use strict';

const url = require('url');
const { getFile } = require('../../services/file-service');

/**
 * Handles rendering the sheets page.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const sheetsHandler = async (req, res) => {
  try {
    console.log('ENTERING SHEETS HANDLER');

    // Parse URL parameters
    const u = url.parse(req.originalUrl, true);
    const title = u.query.title;
    let sheet = u.query.sheet;
    const elementNumber = u.query.elementNumber;
    const sceneNumber = u.query.sceneNumber;

    // Get file data
    const filmFoxFile = await getFile(`${title}/${title}.fff`);
    const { shotList, script, sceneOrder, credits, charactersByScene } = filmFoxFile;

    // Default to current scene if sheet is not provided
    if (!sheet) sheet = sceneNumber;

    // Generate slugs from script data
    const slugs = script.map(s => s[0].dialogue);

    // Prepare shot list and slug list for rendering
    const sList = sceneOrder.map(scene => shotList[scene]);
    const slugList = sceneOrder.map(scene => slugs[scene]);

    // Render sheets page with necessary data
    res.render('paperwork/sheets.njk', {
      title,
      shotList: sList,
      slugs: slugList,
      page: 'Sheets',
      caller: 'sheets',
      size: shotList.length - 1,
      sheet: sheet,
      realTitle: credits.title,
      characterList: charactersByScene[sheet],
      sceneNumber,
      elementNumber,
    });
  } catch (error) {
    // Log and handle errors
    console.error(`Error in sheetsHandler: ${error}`);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { sheetsHandler };
