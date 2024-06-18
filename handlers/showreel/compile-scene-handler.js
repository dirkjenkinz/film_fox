'use strict';

const url = require('url');
const { getFile, getFileList, writeFile } = require('../../services/file-service');

/**
 * Handles the compilation of a specific scene.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
const compileSceneHandler = async (req, res) => {
  try {
    console.log('ENTERING COMPILE SCENE HANDLER');

    // Parse the URL parameters safely
    const u = url.parse(req.originalUrl, true);
    const title = u.query.title;
    const sceneNumber = parseInt(u.query.sceneNumber, 10);

    if (!title || isNaN(sceneNumber)) {
      res.status(400).send('Invalid or missing parameters');
      return;
    }

    // Retrieve filmFoxFile and necessary data
    const filmFoxFile = await getFile(`${title}/${title}.fff`);
    const { script, characterList } = filmFoxFile;

    if (!script || !Array.isArray(script) || !script[sceneNumber]) {
      res.status(404).send('Scene not found');
      return;
    }

    const scene = script[sceneNumber];
    const soundFilesSet = new Set(await getFileList(`data/${title}/sound/sounds`, 'mp3'));
    const queue = [];

    scene.forEach((element, index) => {
      const fileName = `${sceneNumber.toString().padStart(4, '0')}_${index.toString().padStart(4, '0')}.mp3`;

      if (!soundFilesSet.has(fileName)) {
        const characterVoice = characterList.find(c => c[0] === element.character)?.[1] || '';
        queue.push([sceneNumber, index, element.character, characterVoice]);
      }
    });

    if (queue.length > 0) {
      filmFoxFile.queue = queue;
      await writeFile(JSON.stringify(filmFoxFile), `${title}/${title}.fff`);
    }

    res.redirect(`/process-queue?title=${title}`);
  } catch (error) {
    console.error(`Error in compileSceneHandler: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { compileSceneHandler };
