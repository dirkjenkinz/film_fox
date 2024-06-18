const {renderBreakdownHandler} = require('../handlers/showreel/render-breakdown-handler');
const createRouter = require('./routes');
module.exports = createRouter(renderBreakdownHandler);