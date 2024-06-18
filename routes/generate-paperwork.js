const {generatePaperworkHandler} = require('../handlers/paperwork/generate-paperwork-handler');
const createRouter = require('./routes');
module.exports = createRouter(generatePaperworkHandler);