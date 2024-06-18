const {masterHandler} = require('../handlers/showreel/master-handler');
const createRouter = require('./routes');
module.exports = createRouter(masterHandler);