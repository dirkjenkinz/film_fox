const {generateSingleHandler} = require('../handlers/showreel/generate-single-handler');
const createRouter = require('./routes');
module.exports = createRouter(generateSingleHandler);