'use strict';

const { URL } = require('url');
const { deleteFile, getFileList } = require('./services/file-service');

const work = async () => {
  const mp3List = await getFileList('data/Satellite/sound/sounds', 'mp3');
  mp3List.forEach((mp3) => {
    if (mp3.length !== 13){
      deleteFile('Satellite', 'sound/sounds', mp3);
    };
  });
};

work();