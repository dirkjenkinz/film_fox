const { addCategoryHandler } = require('../handlers/paperwork/add-category-handler');
const createRouter = require('./routes');

module.exports = createRouter(addCategoryHandler);
