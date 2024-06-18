const {showGalleryHandler} = require('../handlers/showreel/show-gallery-handler');
const createRouter = require('./routes');
module.exports = createRouter(showGalleryHandler);