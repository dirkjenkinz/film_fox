const {updateNoteHandler} = require('../handlers/showreel/update-note-handler');
const createRouter = require('./routes');
module.exports = createRouter(updateNoteHandler);