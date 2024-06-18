const {generateSceneHandler} = require('../handlers/showreel/generate-scene-handler');
const createRouter = require('./routes');
module.exports = createRouter(generateSceneHandler);