const {concatenateSoundHandler} = require('../handlers/showreel/concatenate-sound-handler');
const createRouter = require('./routes');
module.exports = createRouter(concatenateSoundHandler   );