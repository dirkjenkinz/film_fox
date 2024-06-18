const { addShotHandler } = require('../handlers/paperwork/add-shot-handler');
const createRouter = require('./routes');

module.exports = createRouter(addShotHandler);
