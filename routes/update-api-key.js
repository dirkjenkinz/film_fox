const {updateAPIKeyHandler} = require('../handlers/update-api-key-handler');
const createRouter = require('./routes');
module.exports = createRouter(updateAPIKeyHandler);