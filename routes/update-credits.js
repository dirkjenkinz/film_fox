const {updateCreditsHandler} = require('../handlers/showreel/update-credits-handler');
const createRouter = require('./routes');
module.exports = createRouter(updateCreditsHandler);