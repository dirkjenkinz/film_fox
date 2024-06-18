const {voicesHandler} = require('../handlers/showreel/voices-handler');
const createRouter = require('./routes');
module.exports = createRouter(voicesHandler);