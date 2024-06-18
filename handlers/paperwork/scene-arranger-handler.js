'use strict';

const url = require('url');
const { getFile } = require('../../services/file-service');

/**
 * Handles the scene arranger functionality.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const sceneArrangerHandler = async (req, res) => {
  try {
    console.log('ENTERING SCENE ARRANGER HANDLER');

    // Parse query parameters from the request URL
    const u = url.parse(req.originalUrl, true);
    const title = u.query.title;
    const elementNumber = u.query.elementNumber;
    const sceneNumber = u.query.sceneNumber;

    // Fetch relevant data from the file service
    const { shotList, script, sceneOrder } = await getFile(`${title}/${title}.fff`);

    let { phase = 'select' } = u.query;

    // Extract scene slugs
    const slugs = script.map((s) => s[0].dialogue);

    // Prepare shot lists and slug lists based on scene order
    const sList = sceneOrder.map((sceneNumber) => shotList[sceneNumber]);
    const slugList = sceneOrder.map((sceneNumber) => slugs[sceneNumber]);

   for (let i = 0; i < sceneOrder.length; i++){
      sceneOrder[i] = '_' + sceneOrder[i];
      sceneOrder[i] = sceneOrder[i].substring(sceneOrder[i].length - 2);
   };

    // Render the scene arranger template with necessary data
    res.render('paperwork/scene-arranger.njk', {
      title,
      shotList: sList,
      slugList,
      page: 'Scene Arranger',
      caller: 'scene-arranger',
      elementNumber,
      sceneNumber,
      phase,
      size: shotList.length,
      sceneOrder,
    });
  } catch (error) {
    // Log and handle errors
    console.error(`Error in sceneArrangerHandler: ${error}`);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { sceneArrangerHandler };
