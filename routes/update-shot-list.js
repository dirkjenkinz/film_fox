const {updateShotListHandler} = require('../handlers/paperwork/update-shot-list-handler');
const createRouter = require('./routes');
module.exports = createRouter(updateShotListHandler);