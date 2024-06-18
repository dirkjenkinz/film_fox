const {generateShotSpreadsheetsHandler} = require('../handlers/paperwork/generate-shot-spreadsheets-handler');
const createRouter = require('./routes');
module.exports = createRouter(generateShotSpreadsheetsHandler);