const {editCharacterHandler} = require('../handlers/showreel/edit-character-handler');
const createRouter = require('./routes');
module.exports = createRouter(editCharacterHandler);