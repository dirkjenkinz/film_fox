const {compileAllHandler} = require('../handlers/compile-all-handler');
const createRouter = require('./routes');
module.exports = createRouter(compileAllHandler);
