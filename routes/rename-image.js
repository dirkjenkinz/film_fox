const {renameImageHandler} = require('../handlers/showreel/rename-image-handler');
const createRouter = require('./routes');
module.exports = createRouter(renameImageHandler);