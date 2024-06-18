const {convertHandler} = require('../handlers/convert-handler');
const createRouter = require('./routes');
module.exports = createRouter(convertHandler);