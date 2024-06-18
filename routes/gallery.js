const {galleryHandler} = require('../handlers/showreel/gallery-handler');
const createRouter = require('./routes');
module.exports = createRouter(galleryHandler);