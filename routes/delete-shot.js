const {deleteShotHandler} = require('../handlers/showreel/delete-shot-handler');
const createRouter = require('./routes');
module.exports = createRouter(deleteShotHandler);