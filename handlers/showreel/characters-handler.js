'use strict';

const { URL } = require('url');
const { getFile } = require('../../services/file-service');

/**
 * Handler function for rendering characters page.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const charactersHandler = async (req, res) => {
  try {
    console.log('ENTERING CHARACTERS HANDLER');

    const u = new URL(req.originalUrl, `http://${req.headers.host}`);
    const title = u.searchParams.get('title');
    const sceneNumber = parseInt(u.searchParams.get('sceneNumber'), 10);
    const elementNumber = parseInt(u.searchParams.get('elementNumber'), 10);

    if (!title) {
      res.status(400).send('Title parameter is required');
      return;
    }

    const filmFilePath = `${title}/${title}.fff`;
    if (filmFilePath.includes('../')) {
      res.status(400).send('Invalid path');
      return;
    }

    const filmFoxFile = await getFile(filmFilePath);
    let { nonSpeakers, characterList } = filmFoxFile;

    // Sort nonSpeakers and characterList arrays
    nonSpeakers.sort();
    characterList.sort();

    res.render('showreel/characters.njk', {
      title,
      characters: characterList,
      page: 'Characters',
      caller: 'characters',
      nonSpeakers,
      sceneNumber,
      elementNumber,
    });
  } catch (error) {
    console.error('Error in charactersHandler:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { charactersHandler };
