'use strict';

const url = require('url');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const { getFile, writeFile } = require('../../services/file-service');
const getAudioDurationInSeconds = require('get-audio-duration').getAudioDurationInSeconds;

ffmpeg.setFfmpegPath(ffmpegPath);

const mergeMedia = async (imagePath, audioPath, outputPath) => {
  try {
    const audioDuration = await getAudioDurationInSeconds(audioPath);
    
    ffmpeg()
      .input(imagePath)
      .loop(audioDuration) // Loop image for the duration of the audio
      .input(audioPath)
      .outputOptions([
        '-c:v libx264',        // Use H.264 video codec
        '-tune stillimage',    // Tune for still image
        '-c:a aac',            // Use AAC audio codec
        '-b:a 320k',           // Set higher audio bitrate for better quality
        '-pix_fmt yuv420p',    // Set pixel format
        '-t', audioDuration,   // Set the duration of the video to match the audio
        '-vf scale=1920:1080', // Scale image to 1920x1080 (Full HD, 16:9 aspect ratio)
        '-r 24',               // Set frame rate to 24 fps
      ])
      .format('mov')           // Set output format to .mov
      .on('end', () => {
        console.log(`${outputPath} created`);
      })
      .on('error', (err) => {
        console.error('Error during merging:', err);
      })
      .save(outputPath);
  } catch (err) {
    console.error('Error getting audio duration:', err);
  }
};

const createVideoHandler = async (req, res) => {
  try {
    console.log('ENTERING CREATE VIDEO HANDLER');
    const u = url.parse(req.originalUrl, true);
    const title = u.query.title;
    const sceneNumber = u.query.sceneNumber;

    if (!title || !sceneNumber) {
      res.status(400).send('Missing or invalid parameters');
      return;
    }

    const soundPath = path.join(__dirname, `../../data/${title}/sound/sounds`);
    const imagePath = path.join(__dirname, `../../data/${title}/vision/images`);
    const outPath = path.join(__dirname, `../../data/${title}/vision/videos`);
    const filmFoxFile = await getFile(`${title}/${title}.fff`);

    if (!filmFoxFile.script || !filmFoxFile.script[sceneNumber]) {
      res.status(404).send('Scene not found');
      return;
    }

    const scene = filmFoxFile.script[sceneNumber];
    for (const [index, s] of scene.entries()) {
      const num = `${sceneNumber}`.padStart(4, '0');
      const sub = `${index}`.padStart(4, '0');
      const sound = path.join(soundPath, `${num}_${sub}.mp3`);

      if (s.type === 'movie') s.image = 'blank.png';
      const image = path.join(imagePath, s.image);
      
      const output = path.join(outPath, `${num}_${sub}.mov`);

      if (!s.image) {
        console.error(`Image for scene ${num}_${sub} is missing, skipping...`);
        continue;
      }

      filmFoxFile.queue.push([`${num}_${sub}`, s.image]);
      console.log(filmFoxFile.queue);
      await writeFile(JSON.stringify(filmFoxFile), `${title}/${title}.fff`);
      await mergeMedia(image, sound, output);
    }

    res.redirect(`/video?title=${title}&sceneNumber=${sceneNumber}`);
  } catch (error) {
    console.error(`Error in createVideoHandler: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { createVideoHandler };
