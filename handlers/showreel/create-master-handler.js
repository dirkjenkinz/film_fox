'use strict';

const url = require('url');
const { getFileList } = require('../../services/file-service');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const fs = require('fs');
const path = require('path');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

/**
 * Concatenate multiple video files into a single video file.
 *
 * @param {string[]} inputFiles - Array of input video file paths.
 * @param {string} outputFile - Path to the output video file.
 * @param {string} inputPath - Path to the directory containing input files.
 */
const concatenateVideos = (inputFiles, outputFile, inputPath) => {
  try {
    // Prepend input path to each input file
    const fullInputFiles = inputFiles.map(file => path.join(inputPath, file));

    // Create a temporary file list
    const tempFile = 'temp_file_list.txt';
    const fileContent = fullInputFiles.map(file => `file '${path.resolve(file)}'`).join('\n');
    fs.writeFileSync(tempFile, fileContent);

    ffmpeg()
      .addInput(tempFile)
      .inputOptions(['-f concat', '-safe 0'])
      .outputOptions('-c copy')
      .on('start', (commandLine) => {
        console.log(`Spawned FFmpeg with command: ${commandLine}`);
      })
      .on('error', (err, stdout, stderr) => {
        console.error(`Error: ${err.message}`);
        console.error(`FFmpeg stderr: ${stderr}`);
        fs.unlinkSync(tempFile);
        throw new Error('FFmpeg processing error');
      })
      .on('end', () => {
        console.log('Concatenation finished!');
        fs.unlinkSync(tempFile);
      })
      .save(outputFile);
  } catch (error) {
    console.error(`Error in concatenateVideos: ${error.message}`);
    throw error;
  }
};

/**
 * Handler for creating a master video file by concatenating scene files.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const createMasterHandler = async (req, res) => {
  try {
    console.log('Entering CREATE MASTER HANDLER');
    const parsedUrl = url.parse(req.originalUrl, true);
    const { title } = parsedUrl.query;

    // Get the list of scene files
    const scenesList = await getFileList(`data/${title}/vision/scenes/`, 'mp4');

    // Define paths for input files and output file
    const outputFile = path.join(__dirname, `../../data/${title}/vision/scenes/master.mp4`);
    const inputPath = path.join(__dirname, `../../data/${title}/vision/scenes`);

    // Concatenate videos
    concatenateVideos(scenesList, outputFile, inputPath);

    // Redirect to the video page
    res.redirect(`/video?title=${title}`);
  } catch (error) {
    console.error(`Error in createMasterHandler: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { createMasterHandler };
