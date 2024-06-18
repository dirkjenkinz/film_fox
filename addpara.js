const { getFile, writeFile } = require('./services/file-service');
const title = 'Satellite';
const main = async () => {
    let filmFoxFile = await getFile(`${title}/${title}.fff`);
    let { script } = filmFoxFile;

    for (let i = 0; i < script.length; i++) {
        for (let j = 0; j < script[i].length; j++){
            script[i][j].parenthesis = '';
        }
    }

    filmFoxFile.script = script;

    await writeFile(JSON.stringify(filmFoxFile), `${title}/${title}.fff`);
};

main();