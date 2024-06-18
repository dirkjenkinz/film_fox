const {frontHandler} = require('../handlers/front-handler');
const createRouter = require('./routes');
module.exports = createRouter(frontHandler);