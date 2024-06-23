'use strict';

const url = require('url');
const path = require('path');
const { getFile } = require('../../services/file-service');
const videoStitch = require('video-stitch');
const videoConcat = videoStitch.concat;

// Handler for generating scenes based on the script
const generateSceneHandler = async (req, res) => {
  console.info('ENTERING GENERATE SCENE HANDLER');

  try {
    // Parse query parameters from the request URL
    const u = url.parse(req.originalUrl, true);
    const title = u.query.title;

    // Error handling for missing or invalid title
    if (!title) {
      res.status(400).send('Invalid or missing title in the query parameters.');
      return;
    }

    const filmFoxFile = await getFile(`${title}/${title}.fff`);
    if (!filmFoxFile) {
      console.error('Film file not found');
      res.status(404).send('Film file not found');
      return;
    }

    const { script } = filmFoxFile;
    const sceneNumber = u.query.sceneNumber;
    const videoPath = path.join(__dirname, `../../data/${title}/vision/videos`);
    const scenesPath = path.join(__dirname, `../../data/${title}/vision/scenes`);
    const blank = path.join(__dirname, '../../blank.mov');

    // Determine the range of scenes to generate based on the 'sceneNumber' parameter
    let start, end;
    if (sceneNumber === 'all') {
      start = 0;
      end = script.length;
    } else {
      start = parseInt(sceneNumber, 10);
      end = start + 1;
    }

    // Iterate through the specified scenes and generate videos
    for (let scene = start; scene < end; scene++) {
      const sc = `0000${scene}`.slice(-4);
      const videoList = script[scene].map((_, index) => ({
        fileName: `${videoPath}/${sc}_${('0000' + index).slice(-4)}.mov`
      }));

      // Add blank video to the end of the list for transitions
       videoList.push({ fileName: blank });

      // Define the output file path for the scene
      const outputFile = `${scenesPath}/${sc}.mov`;

      try {
        // Use video-stitch library to concatenate video clips and generate the scene
        await videoConcat({
          silent: true,
          overwrite: true
        })
          .clips(videoList)
          .output(outputFile)
          .concat();

        console.info(`${outputFile} - created`);
      } catch (error) {
        console.error(`Error generating scene ${scene}: ${error.message}`);
      }
    }

    // Redirect to the 'video' page with updated query parameters
    res.redirect(`/video?title=${title}&sceneNumber=0`);
  } catch (error) {
    console.error(`Error in generateSceneHandler: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
};

// Export the generateSceneHandler function for use in other modules
module.exports = { generateSceneHandler };
