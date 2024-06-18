const {categoriesHandler} = require('../handlers/paperwork/categories-handler');
const createRouter = require('./routes');

module.exports = createRouter(categoriesHandler);