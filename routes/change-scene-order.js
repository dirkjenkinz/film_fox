const {changeSceneOrderHandler} = require('../handlers/paperwork/change-scene-order-handler');
const createRouter = require('./routes');

module.exports = createRouter(changeSceneOrderHandler);