const {characterToVoiceHandler} = require('../handlers/showreel/character-to-voice-handler');
const createRouter = require('./routes');
module.exports = createRouter(characterToVoiceHandler);