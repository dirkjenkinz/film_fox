const {sceneArrangerHandler} = require('../handlers/paperwork/scene-arranger-handler');
const createRouter = require('./routes');
module.exports = createRouter(sceneArrangerHandler);