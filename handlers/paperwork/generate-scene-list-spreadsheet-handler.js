'use strict';

// Import required modules
const xlsx = require('xlsx');
const path = require('path');
const { getFile } = require('../../services/file-service');

// Async handler for generating a scene list spreadsheet
const generateSceneListSpreadsheetHandler = async (req, res) => {
  try {
    console.log('ENTERING GENERATE SCENE LIST SPREADSHEET HANDLER');

    // Parse query parameters from the request URL
    const title = new URL(req.originalUrl, `http://${req.headers.host}`).searchParams.get('title');

    // Retrieve film data based on the title
    const filmFile = await getFile(`${title}/${title}.fff`);
    const { script, shotList, credits, breakdown } = filmFile;

    // Initialize workbook and add a title page
    const workbook = xlsx.utils.book_new();
    addTitlePage(workbook, credits);

    // Create scene list and append to workbook
    const sceneList = extractScenes(script, shotList);
    appendWorksheet(workbook, sceneList, 'Scene List');

    // Process scenes and append to workbook
    breakdown.forEach((scene, index) => {
      if (index > 0) {
        const worksheet = xlsx.utils.aoa_to_sheet(scene);
        xlsx.utils.book_append_sheet(workbook, worksheet, `Scene ${index}`);
      };
    });

    // Process breakdown into categories and append to workbook
    const categoriesData = extractCategories(breakdown);
    categoriesData.forEach(category => {
      appendWorksheet(workbook, category.data, category.name);
    });

    // Write the workbook to file and redirect
    writeWorkbook(workbook, title);
    redirectToPaperwork(req, res, title);
  } catch (error) {
    console.error(`Error in generateSceneListSpreadsheetHandler: ${error}`);
    res.status(500).send('Internal Server Error');
  }
};

// Functions used in the main handler
function addTitlePage(workbook, credits) {
  const titlePage = [
    [], [], ['', credits.title], [], ['', 'A Screenplay'], ['', 'by'], ['', credits.writer]
  ];
  const worksheet = xlsx.utils.aoa_to_sheet(titlePage);
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Title Page');
}

function extractScenes(script, shotList) {
  return script.map((scene, index) => {
    if (index === 0) return []; // Skip header if present

    const dialogue = scene[0].dialogue;
    const firstDotPosition = dialogue.indexOf('.');
    const firstDashPosition = dialogue.indexOf('-');

    const int_ext = dialogue.substring(0, firstDotPosition);
    const location = dialogue.substring(firstDotPosition + 1, firstDashPosition).trim();
    let time_of_day = dialogue.substring(firstDashPosition + 1).trim();

    if (time_of_day.includes('-')) {
      time_of_day = time_of_day.split('-')[0].trim();
    }

    return [`Scene ${index}`, int_ext, location, time_of_day, shotList[index]?.note || ''];
  }).filter(row => row.length); // Filter out any empty rows
}

function extractCategories(breakdown) {
  // Assuming each category header is in the first row of breakdown, and it may not be a plain string
  const categories = breakdown[0].map(header => {
    // Ensure the header is a string; this depends on the actual data structure of header
    const headerName = typeof header === 'string' ? header : header.toString();
    return { name: headerName.replace(/ /g, '_'), data: [] };
  });

  // Iterate over each line in the breakdown after the header row
  breakdown.slice(1).forEach((line, index) => {
    line.forEach((cell, cellIndex) => {
      // Ensure the cell content is properly handled; convert to string if necessary
      let cellContent = Array.isArray(cell) ? cell.join(', ') : cell;
      const ptr = cellContent.indexOf(',');
      if (ptr === -1) {
        cellContent = '';
      } else {
        cellContent = cellContent.substring(ptr + 1).trim();
      };
      categories[cellIndex].data.push([`SCENE ${index + 1}`, cellContent]);
    });
  });
  return categories;
}

function appendWorksheet(workbook, data, sheetName) {
  const worksheet = xlsx.utils.aoa_to_sheet(data);
  xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
}

function writeWorkbook(workbook, title) {
  const outPath = path.join(__dirname, `../../data/${title}/paperwork/scene_list/sceneList.xlsx`);
  xlsx.writeFile(workbook, outPath);
  console.log('sceneList.xlsx created successfully');
}

function redirectToPaperwork(req, res, title) {
  const returnUrl = `/generate-paperwork?title=${title}`;
  res.redirect(returnUrl);
}

module.exports = { generateSceneListSpreadsheetHandler };
