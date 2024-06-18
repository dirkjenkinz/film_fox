const {slideshowHandler} = require('../handlers/showreel/slideshow-handler');
const createRouter = require('./routes');
module.exports = createRouter(slideshowHandler);