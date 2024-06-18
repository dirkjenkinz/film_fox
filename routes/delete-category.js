const {deleteCategoryHandler} = require('../handlers/paperwork/delete-category-handler');
const createRouter = require('./routes');
module.exports = createRouter(deleteCategoryHandler);