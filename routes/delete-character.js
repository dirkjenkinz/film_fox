const {deleteCharacterHandler} = require('../handlers/showreel/delete-character-handler');
const createRouter = require('./routes');
module.exports = createRouter(deleteCharacterHandler);