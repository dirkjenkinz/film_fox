const {displayHandler} = require('../handlers/display-handler');
const createRouter = require('./routes');
module.exports = createRouter(displayHandler);