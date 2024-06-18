const {addCharacterToSceneHandler} = require('../handlers/showreel/add-character-to-scene-handler');
const createRouter = require('./routes');

module.exports = createRouter(addCharacterToSceneHandler);
