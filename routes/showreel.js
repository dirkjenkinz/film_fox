const {showreelHandler} = require('../handlers/showreel/showreel-handler');
const createRouter = require('./routes');
module.exports = createRouter(showreelHandler);