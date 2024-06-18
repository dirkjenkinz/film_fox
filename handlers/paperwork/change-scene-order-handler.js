'use strict';

const url = require('url');
const { getFile, writeFile } = require('../../services/file-service');

/**
 * Function to reset scene order based on length.
 *
 * @param {number} length - The length of the scene order.
 * @returns {number[]} The new scene order array.
 */
const resetOrder = (length) => {
  const newSceneOrder = [];
  for (let i = 0; i < length; i++) {
    newSceneOrder.push(i);
  }
  return newSceneOrder;
};

/**
 * Handles requests to change the scene order.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const changeSceneOrderHandler = async (req, res) => {
  try {
    // Log entering the scene order change handler
    console.log('ENTERING CHANGE SCENE ORDER HANDLER');

    // Parse the URL to extract query parameters
    const parsedUrl = url.parse(req.originalUrl, true);
    const title = parsedUrl.query.title;
    let from = parsedUrl.query.from;
    let to = parsedUrl.query.to;
    const reset = parsedUrl.query.reset;

    // Retrieve film file and necessary data
    const filmFoxFile = await getFile(`${title}/${title}.fff`);
    let { sceneOrder } = filmFoxFile;

    // Check if reset is requested
    if (reset === 'yes') {
      filmFoxFile.sceneOrder = resetOrder(sceneOrder.length);
    } else {
      // Change scene order based on 'from' and 'to' parameters
      if (parseInt(from) > parseInt(to)) {
        const hold = sceneOrder[parseInt(from)];
        sceneOrder.splice(from, 1);

        const newSceneOrder = [
          ...sceneOrder.slice(0, to),
          hold,
          ...sceneOrder.slice(to)
        ];
        filmFoxFile.sceneOrder = newSceneOrder;
      }

      if (parseInt(from) < parseInt(to)) {
        const newSceneOrder = [
          ...sceneOrder.slice(0, to),
          sceneOrder[parseInt(from)],
          ...sceneOrder.slice(to)
        ];
        newSceneOrder.splice(parseInt(from), 1);

        filmFoxFile.sceneOrder = newSceneOrder;
      }
    }

    // Write the updated file back
    await writeFile(JSON.stringify(filmFoxFile), `${title}/${title}.fff`);

    // Redirect to scene arranger with necessary parameters
    res.redirect(`/scene-arranger?title=${title}&elementNumber=0&sceneNumber=0`);
  } catch (error) {
    // Handling errors and sending a 500 Internal Server Error response
    console.error('Error in changeSceneOrderHandler:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Export the handler function
module.exports = { changeSceneOrderHandler };
