'use strict';

const { parse } = require('url');
const { getFile, getFileList } = require('../../services/file-service');

// Function to extract unique images used in the script
const extractUniqueImagesFromScript = (script) => {
  const usedImages = script.flatMap(scene => scene.map(s => s.image));
  return [...new Set(usedImages)];
};

// Handler for rendering the gallery
const galleryHandler = async (req, res) => {
  console.info('ENTERING GALLERY HANDLER');

  try {
    // Parse query parameters from the request URL
    const u = parse(req.originalUrl, true);
    const { sceneNumber, title, elementNumber, caller, speak } = u.query;

    if (!title) {
      res.status(400).send('Missing required parameter: title');
      return;
    }

    // Fetch image list from the 'vision/images' directory
    const imageList = await getFileList(`data/${title}/vision/images`, '*');
    if (!imageList) {
      console.error('Image list not found');
      res.status(404).send('Image list not found');
      return;
    }
    imageList.unshift('blank.jpg');

    // Categorize images as either 'movie' or 'still'
    const images = imageList.map((imageName) => {
      const extension = imageName.substring(imageName.length - 4).toLowerCase();
      return [imageName, extension.match(/\.(mov|mp4|avi|wmv|mkv)$/) ? 'movie' : 'still'];
    });

    // Fetch movie file information asynchronously
    const filmFoxFile = await getFile(`${title}/${title}.fff`);
    if (!filmFoxFile) {
      console.error('Film file not found');
      res.status(404).send('Film file not found');
      return;
    }
    const { script } = filmFoxFile;

    // Get a list of unique images used in the script
    const usedImages = extractUniqueImagesFromScript(script);

    // Partition images into 'used' and 'unused' based on script usage
    const used = images.filter(image => usedImages.includes(image[0]));
    const unused = images.filter(image => !usedImages.includes(image[0]));

    // Render the 'gallery' template with relevant data
    res.render('showreel/gallery.njk', {
      title,
      elementNumber,
      sceneNumber,
      used,
      unused,
      caller,
      page: 'Gallery',
      speak,
    });
  } catch (error) {
    console.error(`Error rendering gallery: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
};

// Export the galleryHandler function for use in other modules
module.exports = { galleryHandler };
