const {charactersHandler} = require('../handlers/showreel/characters-handler');
const createRouter = require('./routes');
module.exports = createRouter(charactersHandler);