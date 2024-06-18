const {deleteImageHandler} = require('../handlers/showreel/delete-image-handler');
const createRouter = require('./routes');
module.exports = createRouter(deleteImageHandler);