const {playMasterHandler} = require('../handlers/showreel/play-master-handler');
const createRouter = require('./routes');
module.exports = createRouter(playMasterHandler);