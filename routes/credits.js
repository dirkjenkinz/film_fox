const {creditsHandler} = require('../handlers/showreel/credits-handler');
const createRouter = require('./routes');
module.exports = createRouter(creditsHandler);