'use strict';

const { getFile, writeFile } = require('../../services/file-service');
const { generateSpeech } = require('../../services/elevenLabs');

// Handler for generating a single speech element
const generateSingleHandler = async (req, res) => {
  console.info('Entering GENERATE SINGLE HANDLER');

  try {
    const params = new URL(req.originalUrl, `http://${req.headers.host}`).searchParams;
    const title = params.get('title');
    const sceneNumber = parseInt(params.get('sceneNumber'), 10);
    const elementNumber = parseInt(params.get('elementNumber'), 10);
    const character = params.get('character');
    const caller = params.get('caller');
    const voice = params.get('voice');
    const mute = params.get('mute');

    if (!title || sceneNumber < 0 || elementNumber < 0 || !voice) {
      console.error('Missing or invalid parameters');
      res.status(400).send('Missing or invalid parameters');
      return;
    }

    const [controlData, scriptData, voiceData] = await Promise.all([
      getFile('control.json'),
      getFile(`${title}/${title}.fff`),
      getFile('voices.json')
    ]);

    const script = scriptData.script;
    if (!script[sceneNumber] || !script[sceneNumber][elementNumber]) {
      throw new Error('Script element does not exist');
    }
    const element = script[sceneNumber][elementNumber];

    const sc = sceneNumber.toString().padStart(4, '0');
    const el = elementNumber.toString().padStart(4, '0');
    const fileName = `${sc}_${el}.mp3`;

    const voiceId = voiceData.find(v => v.name === voice)?.voice_id || '';

    let dialogue = element.dialogue;
    if (element.character === 'NARRATOR') {
      if (dialogue.startsWith('INT.')) {
        dialogue = `INTERIOR. ${dialogue.substring(4)}`;
      } else if (dialogue.startsWith('EXT.')) {
        dialogue = `EXTERIOR. ${dialogue.substring(4)}`;
      } 
    }

    let msg = await generateSpeech(controlData.apiKey, voiceId, fileName, dialogue, title);

    if (msg !== 'Failed') {
      script[sceneNumber][elementNumber].voice = voice;
      await writeFile(JSON.stringify(scriptData), `${title}/${title}.fff`);
      msg = 'OK';
    }

    let redirectUrl = `/showreel?title=${title}&sceneNumber=${sceneNumber}&elementNumber=${elementNumber}&speak=yes&mute=${mute}&msg=${msg}`;
    switch (caller) {
      case 'edit-character':
        redirectUrl = `/edit-character?title=${title}&character=${character}&msg=${msg}`;
        break;
      case 'sound':
        redirectUrl = `/sound?title=${title}&sceneNumber=${sceneNumber}&elementNumber=${elementNumber}`;
        break;
    }

    setTimeout(() => {
      res.redirect(redirectUrl);
    }, 3000);
  } catch (error) {
    console.error(`Error in generateSingleHandler: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { generateSingleHandler };
