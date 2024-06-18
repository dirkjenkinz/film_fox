const {getSamplesHandler} = require('../handlers/showreel/get-samples-handler');
const createRouter = require('./routes');
module.exports = createRouter(getSamplesHandler);