'use strict';

const url = require('url');
const { getFileList } = require('../../services/file-service');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const fs = require('fs');
const path = require('path');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const concatenateVideos = (inputFiles, outputFile, inputPath, title) => {

  for (let i = 0; i < inputFiles.length; i++){
    inputFiles[i] = `${inputPath}/${inputFiles[i]}`;
  };

  // Create a temporary file list
  const tempFile = 'temp_file_list.txt';
  const fileContent = inputFiles.map(file => `file '${path.resolve(file)}'`).join('\n');

  fs.writeFileSync(tempFile, fileContent);

  ffmpeg()
    .addInput(tempFile)
    .inputOptions(['-f concat', '-safe 0'])
    .outputOptions('-c copy')
    .on('start', commandLine => {
      console.log('Spawned FFmpeg with command: ' + commandLine);
    })
    .on('error', (err, stdout, stderr) => {
      console.error('Error: ' + err.message);
      console.error('FFmpeg stderr: ' + stderr);
      fs.unlinkSync(tempFile);
    })
    .on('end', () => {
      console.log('Concatenation finished!');
      fs.unlinkSync(tempFile);
    })
    .save(outputFile);
};

const createMasterHandler = async (req, res) => {
  try {
    console.log('ENTERING CREATE MASTER HANDLER');
    const u = url.parse(req.originalUrl, true);
    const title = u.query.title;

    const scenesList = await getFileList(`data/${title}/vision/scenes/`, 'mp4');
    const outputFile = path.join(__dirname, `../../data/${title}/vision/scenes/master.mp4`);
    const inputPath = path.join(__dirname, `../../data/${title}/vision/scenes`);
    concatenateVideos(scenesList, outputFile, inputPath, title);

    res.redirect(`/video?title=${title}`);
  } catch (error) {
    console.error(`Error in createMasterHandler: ${error}`);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { createMasterHandler };
