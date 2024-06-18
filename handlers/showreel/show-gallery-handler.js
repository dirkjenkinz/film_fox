'use strict';

const { URL } = require('url');
const {
  getFileList,
  getFile,
} = require('../../services/file-service');

/**
 * Extracts unique images used in the script.
 * @param {Array} script - The script containing scenes and images.
 * @returns {Array} - An array of unique images used in the script.
 */
const getUsedImages = (script) => {
  const used = new Set();
  script.forEach(scene => {
    scene.forEach(s => used.add(s.image));
  });
  return [...used];
};

/**
 * Handles the request to show the gallery.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Renders the show-gallery page.
 */
const showGalleryHandler = async (req, res) => {
  console.info('ENTERING SHOW GALLERY HANDLER');

  try {
    // Parsing query parameters from the URL
    const u = new URL(req.originalUrl, `http://${req.headers.host}`);
    const title = u.searchParams.get('title');
    const sceneNumber = parseInt(u.searchParams.get('sceneNumber'), 10);
    const elementNumber = parseInt(u.searchParams.get('elementNumber'), 10);
    const caller = u.searchParams.get('caller');
    const mute = u.searchParams.get('mute');

    if (!title || isNaN(sceneNumber) || isNaN(elementNumber)) {
      console.error('Invalid input parameters');
      res.status(400).send('Invalid input parameters');
      return;
    }

    // Fetching the list of images in the specified directory
    const imageList = await getFileList(`data/${title}/vision/images`, '*');
    if (!imageList) {
      console.error('No images found');
      res.status(404).send('No images found');
      return;
    }

    // Fetching script from the specified file
    const filmFoxFile = await getFile(`${title}/${title}.fff`);
    if (!filmFoxFile) {
      console.error('Film file not found');
      res.status(404).send('Film file not found');
      return;
    }

    const { script } = filmFoxFile;
    const usedImages = getUsedImages(script);

    // Processing image list and categorizing them as 'movie' or 'still'
    const images = imageList.map((image) => {
      const extension = image.substring(image.length - 4);
      const type = ['.mov', '.mp4', '.avi', '.wmv', '.mkv'].includes(extension) ? 'movie' : 'still';
      const isUsed = usedImages.includes(image);
      return { image, type, isUsed: isUsed ? 'yes' : 'no', extension };
    });

    // Rendering the show-gallery page
    res.render('showreel/show-gallery.njk', {
      title,
      elementNumber,
      sceneNumber,
      images,
      caller,
      page: 'Show Gallery',
      mute,
    });
  } catch (error) {
    console.error('Error in showGalleryHandler:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { showGalleryHandler };
