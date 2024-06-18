'use strict';
const url = require('url');
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-creator-node');

// PDF creation options
const pdfOptions = {
  format: 'A4',
  orientation: 'landscape',
  border: '5mm',
  header: {
      height: '5mm',
  },
  footer: {
      height: '40mm',
      contents: {
          default: '<span class="document-footer">{{page}}</span> of <span>{{pages}}</span>',
          last: 'Last Page'
      }
  }
};

// Importing necessary services
const { getFile } = require('../../services/file-service');

/**
 * Generates a PDF document for a scene's shot list.
 * @param {Object} shotList - Shot list for the scene.
 * @param {string} title - Title of the film.
 * @param {number} sceneNumber - Scene number.
 * @param {string} slug - Slug for the scene.
 */
const shotListPDF = async (shotList, title, sceneNumber, slug) => {
  try {
    let fileName = '0000' + sceneNumber;
    fileName = 'shots' + fileName.substring(fileName.length - 4) + '.pdf';

    const htmlPath = path.join(__dirname, '../../pages/templates/shots.html');
    const outPath = path.join(__dirname, `../../data/${title}/paperwork/shots/${fileName}`);
    let html = fs.readFileSync(htmlPath, 'utf8');

    const document = {
        html: html,
        data: {
            title: title,
            scene: sceneNumber,
            slug: slug,
            lines: shotList.lines
        },
        path: outPath,
        type: '',
    };

    const result = await pdf.create(document, pdfOptions);
    console.log(`Created ShotList PDF: ${result.filename}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Handles the generation of shot PDFs for multiple scenes.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const generateShotPDFsHandler = async (req, res) => {
  try {
    console.log('Entering Generate SHOT PDFs Handler');

    // Function to delay execution using Promises
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // Parsing the original URL to extract query parameters
    const parsedUrl = url.parse(req.originalUrl, true);
    const title = parsedUrl.query.title;
    const sceneNumber = parsedUrl.query.sceneNumber;
    const elementNumber = parsedUrl.query.elementNumber;

    // Fetching breakdown data from the file service
    const filmFoxFile = await getFile(`${title}/${title}.fff`);
    const { breakdown, script, credits, shotList } = filmFoxFile;

    // Iterate over scenes and generate paperwork
    for (let scene = 1; scene < breakdown.length; scene++) {
      // Introduce a delay between paperwork generation
      await delay(10);
      await shotListPDF(shotList[scene], credits.title, scene, script[scene][0].dialogue);
    }

    // Redirect to the original page with updated parameters
    const returnUrl = `/generate-paperwork?title=${title}&sceneNumber=${sceneNumber}&elementNumber=${elementNumber}`;
    res.redirect(returnUrl);
  } catch (error) {
    // Handling errors and sending an appropriate response
    console.error(`Error generating shot PDFs: ${error}`);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { generateShotPDFsHandler };
