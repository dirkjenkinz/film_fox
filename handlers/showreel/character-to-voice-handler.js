'use strict';

const url = require('url');
const { getFile } = require('../../services/file-service');

/**
 * Transform and sort voice data.
 * @param {Array} voices - Array of voice data objects.
 * @returns {Array} - Sorted and transformed voice data.
 */
const getVoiceData = (voices) => {
  return voices.map(voice => [
    voice.name,
    voice.description,
    voice.voice_id,
    voice.labels.description,
    voice.labels.gender,
    voice.labels.accent,
    voice.labels.age
  ]).sort((a, b) => a[0].localeCompare(b[0])); // Sorting by name for example
};

/**
 * Handler function for character-to-voice mapping.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const characterToVoiceHandler = async (req, res) => {
  try {
    console.log('ENTERING CHARACTER TO VOICE HANDLER');

    const { query } = url.parse(req.originalUrl, true);
    const title = query.title;
    if (!title) {
      res.status(400).send('Title is required');
      return;
    }

    const sceneNumber = parseInt(query.sceneNumber, 10) || 0;
    const elementNumber = parseInt(query.elementNumber, 10) || 0;

    const filmFoxFile = await getFile(`${title}/${title}.fff`);
    if (!filmFoxFile.characterList) {
      res.status(404).send('Character list not found');
      return;
    }

    const voices = await getFile('voices.json');
    let voiceData = getVoiceData(voices);

    voiceData.unshift(['-', '', '', '', '', '', '']); // Add a default entry

    const usedVoices = new Set();
    filmFoxFile.characterList.forEach(c => {
      const matchingVoice = voiceData.find(v => v[0] === c[1]);
      if (matchingVoice) {
        c[2] = matchingVoice[2];
        usedVoices.add(matchingVoice[0]);
      }
    });

    voiceData.forEach(v => v.push(usedVoices.has(v[0]) ? 'yes' : 'no'));

    res.render('showreel/character-to-voice.njk', {
      title,
      characters: filmFoxFile.characterList,
      voice_data: voiceData,
      sceneNumber,
      elementNumber,
      page: 'Voice Map',
      caller: 'voice-map',
    });
  } catch (error) {
    console.error(`Error in characterToVoiceHandler: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { characterToVoiceHandler };
