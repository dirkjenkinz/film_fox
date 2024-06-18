const {videoHandler} = require('../handlers/showreel/video-handler');
const createRouter = require('./routes');
module.exports = createRouter(videoHandler);