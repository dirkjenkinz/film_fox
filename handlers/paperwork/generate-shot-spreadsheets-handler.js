'use strict';
const xlsx = require('xlsx');
const path = require('path');
const url = require('url');
const { getFile } = require('../../services/file-service');

// Function to delay execution using Promises
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Create an XLSX file from CSV data.
 * @param {string} csvData - CSV data for the scene.
 * @param {string} fileName - Name for the XLSX file.
 * @param {string} title - Title of the film.
 */
const createXLS = (csvData, fileName, title) => {
  try {
    // Convert CSV to array of arrays
    const rows = csvData.trim().split('\n').map(line => line.split(','));

    // Create a new workbook
    const workbook = xlsx.utils.book_new();

    // Add a worksheet
    const worksheet = xlsx.utils.aoa_to_sheet(rows);

    // Add the worksheet to the workbook
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Write the workbook to an XLSX file
    const outPath = path.join(__dirname, `../../data/${title}/paperwork/shots/${fileName}.xlsx`);
    xlsx.writeFile(workbook, outPath, { bookType: 'xlsx', bookSST: false, type: 'binary' });

    console.log(`${fileName}.xlsx created successfully`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Generates a CSV file for a scene's shot list and converts it to XLSX format.
 * @param {Object} shotList - Shot list for the scene.
 * @param {string} title - Title of the film.
 * @param {number} sceneNumber - Scene number.
 * @param {string} slug - Slug for the scene.
 */
const shotListCSV = async (shotList, title, sceneNumber, slug) => {
  try {
    let csv = `${title}, Scene ${sceneNumber}, ${slug},Day ,,,,,\n\n`;
    csv += 'SHOT,ANGLE,MOVE,AUDIO,SUBJECT,DESCRIPTION,DONE\n';

    // Adding shot-wise details
    shotList.lines.forEach((shot) => {
      csv += `${shot.shot}, ${shot.angle}, ${shot.move}, ${shot.audio}, ${shot.subject}, ${shot.description}\n`;
    });

    // Creating a unique file name based on scene number
    let fileNumber = '0000' + sceneNumber;
    fileNumber = fileNumber.substring(fileNumber.length - 4);
    const fileName = 'shots' + fileNumber;

    await createXLS(csv, fileName, title);
  } catch (error) {
    throw error;
  }
};

/**
 * Handles the generation of shot list spreadsheets for multiple scenes.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const generateShotSpreadsheetsHandler = async (req, res) => {
  try {
    console.log('ENTERING GENERATE SHOT SPREADSHEETS HANDLER');

    // Parse query parameters from the request URL
    const u = url.parse(req.originalUrl, true);
    const title = u.query.title;
    const sceneNumber = u.query.sceneNumber;
    const elementNumber = u.query.elementNumber;

    // Retrieve filmFoxFile data
    const filmFoxFile = await getFile(`${title}/${title}.fff`);
    const { shotList, script, credits, breakdown } = filmFoxFile;

    // Iterate over scenes and generate paperwork
    for (let scene = 1; scene < breakdown.length; scene++) {
      // Introduce a delay of 100 milliseconds between paperwork generation
      await delay(100);

      await shotListCSV(shotList[scene], credits.title, scene, script[scene][0].dialogue);
    }

    // Redirect to the original page with updated parameters
    const returnUrl = `/generate-paperwork?title=${title}&sceneNumber=${sceneNumber}&elementNumber=${elementNumber}`;
    res.redirect(returnUrl);
  } catch (error) {
    // Log and handle errors
    console.error(`Error in generateShotSpreadsheetsHandler: ${error}`);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { generateShotSpreadsheetsHandler };
