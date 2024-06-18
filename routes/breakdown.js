const {breakdownHandler} = require('../handlers/paperwork/breakdown-handler');
const createRouter = require('./routes');

module.exports = createRouter(breakdownHandler);