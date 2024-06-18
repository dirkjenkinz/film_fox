const {updateImageDisplayHandler} = require('../handlers/showreel/update-image-display-handler');
const createRouter = require('./routes');
module.exports = createRouter(updateImageDisplayHandler);