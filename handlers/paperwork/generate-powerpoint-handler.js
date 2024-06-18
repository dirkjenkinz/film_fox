'use strict';

const url = require('url');
const path = require('path');
const pptxgen = require('pptxgenjs');
const { getFile, getDuration } = require('../../services/file-service');

/**
 * Handles the creation of PowerPoint presentations.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const generatePowerpointHandler = async (req, res) => {
  try {
    // Log entry information
    console.log('ENTERING GENERATE POWERPOINT HANDLER');

    // Parse query parameters from the request URL
    const parsedUrl = url.parse(req.originalUrl, true);
    const { title, sceneNumber, elementNumber } = parsedUrl.query;

    // Define paths for image and output PowerPoint file
    const imagePath = path.join(__dirname, `../../data/${title}/vision/images`);
    const outPath = path.join(__dirname, `../../data/${title}/paperwork/ppt`);
    const output = `${outPath}/master.pptx`;

    // Generate a new PowerPoint presentation instance
    const pres = new pptxgen();

    // Retrieve script data from the filmFoxFile
    const filmFoxFile = await getFile(`${title}/${title}.fff`);
    console.log(`${title}.fff retrieved`);
    const { script } = filmFoxFile;

    // Iterate through scenes and elements to generate PowerPoint slides
    for (let sceneIndex = 0; sceneIndex < script.length; sceneIndex++) {
      for (let elementIndex = 0; elementIndex < script[sceneIndex].length; elementIndex++) {
        // Format scene and element numbers
        const num = `0000${sceneIndex}`.slice(-4);
        const sub = `0000${elementIndex}`.slice(-4);
        const fileName = `${num}_${sub}.mp3`;

        // Retrieve audio duration and image path
        const dur = await getDuration(title, fileName);
        const image = `${imagePath}/${script[sceneIndex][elementIndex].image}`;
        let duration = Math.ceil(dur) + 1;
        if (duration < 4) duration = 4;

        // Extract dialogue text and format if character is not 'NARRATOR'
        let text = script[sceneIndex][elementIndex].dialogue;
        if (script[sceneIndex][elementIndex].character !== 'NARRATOR') {
          text = `${script[sceneIndex][elementIndex].character}:\n\n${text}`;
        }

        // Generate a new slide and add image, scene information, and dialogue text
        const slide = pres.addSlide();
        slide.addImage({ x: 0.2, y: 1.0, w: 6.0, h: 4.0, path: image });

        slide.addText(`${title} - Scene ${num}`, {
          x: 0.5,
          y: 0.5,
          color: '363636',
          fill: { color: 'F1F1F1' },
          align: pres.AlignH.left,
        });

        slide.addText(`element ${sub}`, {
          x: 0.5,
          y: 0.8,
          color: '363636',
          fill: { color: 'F1F1F1' },
          fontFace: 'Arial',
          fontSize: 8,
          align: pres.AlignH.left,
        });

        slide.addText(text, {
          x: 6.3,
          y: 2.0,
          w: 3.5,
          color: '363636',
          fill: { color: 'F1F1F1' },
          fontFace: 'Arial',
          fontSize: 10,
          bold: true,
          isTextBox: true,
          align: pres.AlignH.left,
        });
      }
    }

    // Save the PowerPoint presentation to a file
    pres.writeFile({ fileName: output });

    // Redirect to video page with updated parameters
    res.redirect(`/generate-paperwork?title=${title}&sceneNumber=${sceneNumber}&elementNumber=${elementNumber}`);
  } catch (error) {
    // Handle errors and send an appropriate response
    console.error(`generatePowerPointHandler: ${error}`);
    res.status(500).send('Internal Server Error');
  }
};

// Export the generatePowerpointHandler function for use in other modules
module.exports = { generatePowerpointHandler };
