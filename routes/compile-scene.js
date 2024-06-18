const {compileSceneHandler} = require('../handlers/showreel/compile-scene-handler');
const createRouter = require('./routes');
module.exports = createRouter(compileSceneHandler);