const {generateSceneListSpreadsheetHandler} = require('../handlers/paperwork/generate-scene-list-spreadsheet-handler');
const createRouter = require('./routes');
module.exports = createRouter(generateSceneListSpreadsheetHandler);