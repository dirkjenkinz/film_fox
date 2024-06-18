const {generatePowerpointHandler} = require('../handlers/paperwork/generate-powerpoint-handler');
const createRouter = require('./routes');
module.exports = createRouter(generatePowerpointHandler);