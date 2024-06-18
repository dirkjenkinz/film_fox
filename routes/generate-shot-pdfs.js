const {generateShotPDFsHandler} = require('../handlers/paperwork/generate-shot-pdfs-handler');
const createRouter = require('./routes');
module.exports = createRouter(generateShotPDFsHandler);