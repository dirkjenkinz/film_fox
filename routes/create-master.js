const { createMasterHandler } = require('../handlers/showreel/create-master-handler');
const createRouter = require('./routes');

module.exports = createRouter(createMasterHandler);
