const {createVideoHandler} = require('../handlers/showreel/create-video-handler');
const createRouter = require('./routes');
module.exports = createRouter(createVideoHandler);