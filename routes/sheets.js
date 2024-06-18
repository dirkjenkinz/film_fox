const {sheetsHandler} = require('../handlers/paperwork/sheets-handler');
const createRouter = require('./routes');
module.exports = createRouter(sheetsHandler);