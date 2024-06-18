'use strict';

const { URL } = require('url');
const { renameFile, getFile, writeFile } = require('../../services/file-service');

// Handler for renaming an image and updating script references
const renameImageHandler = async (req, res) => {
  console.info('ENTERING RENAME IMAGE HANDLER');

  try {
    // Parse query parameters from the request URL
    const u = new URL(req.originalUrl, `http://${req.headers.host}`);
    const title = u.searchParams.get('title');
    const sceneNumber = parseInt(u.searchParams.get('sceneNumber'), 10);
    const elementNumber = parseInt(u.searchParams.get('elementNumber'), 10);
    const from = u.searchParams.get('from');
    let to = u.searchParams.get('to');

    // Validate input parameters
    if (!title || isNaN(sceneNumber) || isNaN(elementNumber) || !from || !to) {
      console.error('Invalid input parameters');
      res.status(400).send('Invalid input parameters');
      return;
    }

    // Fetch script file for the given title
    const filmFoxFile = await getFile(`${title}/${title}.fff`);
    if (!filmFoxFile) {
      console.error('Film file not found');
      res.status(404).send('Film file not found');
      return;
    }

    let { script } = filmFoxFile;

    // Determine file types and append if missing
    const fileType = from.substring(from.lastIndexOf('.'));
    if (!to.endsWith(fileType)) {
      to += fileType;
    }

    // Rename the image file
    await renameFile(title, 'vision/images', from, to);

    // Update references to the file in the script
    script.forEach(scene => {
      scene.forEach(e => {
        if (e.image === from) {
          e.image = to;
        }
      });
    });

    // Save the updated script to the file
    await writeFile(JSON.stringify(filmFoxFile), `${title}/${title}.fff`);

    // Redirect to the show-gallery page
    res.redirect(`/show-gallery?title=${title}&elementNumber=${elementNumber}&sceneNumber=${sceneNumber}`);
  } catch (error) {
    console.error('Error in renameImageHandler:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { renameImageHandler };
