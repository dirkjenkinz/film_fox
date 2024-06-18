const {addCharacterHandler} = require('../handlers/showreel/add-character-handler');
const createRouter = require('./routes');

module.exports = createRouter(addCharacterHandler);
