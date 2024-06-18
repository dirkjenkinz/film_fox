const {sceneShotListHandler} = require('../handlers/paperwork/scene-shot-list-handler');
const createRouter = require('./routes');
module.exports = createRouter(sceneShotListHandler);