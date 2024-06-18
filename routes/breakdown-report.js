const {breakdownReportHandler} = require('../handlers/paperwork/breakdown-report-handler');
const createRouter = require('./routes');

module.exports = createRouter(breakdownReportHandler);
