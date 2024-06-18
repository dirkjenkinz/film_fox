const {characterUpdateHandler} = require('../handlers/showreel/character-update-handler');
const createRouter = require('./routes');
module.exports = createRouter(characterUpdateHandler);