const {deleteHandler} = require('../handlers/showreel/delete-handler');
const createRouter = require('./routes');
module.exports = createRouter(deleteHandler);