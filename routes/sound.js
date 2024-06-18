const {soundHandler} = require('../handlers/showreel/sound-handler');
const createRouter = require('./routes');
module.exports = createRouter(soundHandler);