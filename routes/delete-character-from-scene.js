const {deleteCharacterFromSceneHandler} = require('../handlers/showreel/delete-character-from-scene-handler');
const createRouter = require('./routes');
module.exports = createRouter(deleteCharacterFromSceneHandler);