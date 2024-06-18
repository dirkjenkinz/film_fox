'use strict';
const path = require('path');
const url = require('url');
const { getFileList } = require('../../services/file-service');

/**
 * Handles requests to generate paperwork.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const generatePaperworkHandler = async (req, res) => {
  try {
    // Log entering the generate paperwork handler
    console.log('ENTERING GENERATE PAPERWORK HANDLER');

    // Parse the URL to extract query parameters
    const parsedUrl = url.parse(req.originalUrl, true);
    const title = parsedUrl.query.title;
    let showDirectory = parsedUrl.query.directory;
    let fileList1 = '';
    let fileList2 = '';

    // Retrieve file lists based on directory type
    if (showDirectory) {
      if (showDirectory.endsWith('ppt')) {
        fileList1 = await getFileList(`data/${showDirectory}`, 'pptx');
      } else {
        fileList1 = await getFileList(`data/${showDirectory}`, 'xlsx');
        fileList2 = await getFileList(`data/${showDirectory}`, 'pdf');
      }
    }

    // Render the generate-paperwork template with necessary data
    res.render('paperwork/generate-paperwork.njk', {
      title,
      page: 'Generate Paperwork',
      caller: 'generate-paperwork',
      categoryDirectory: `.../${title}/paperwork/breakdown`,
      sheetDirectory: `.../${title}/paperwork/sheets`,
      shotDirectory: `.../${title}/paperwork/shots`,
      powerpointDirectory: `.../${title}/paperwork/ppt`,
      sceneListDirectory: `.../${title}/paperwork/scene_list`,
      showDirectory,
      fileList1,
      fileList2,
    });
  } catch (error) {
    // Handle errors and send an appropriate response
    console.error(`Error in generatePaperworkHandler: ${error}`);
    res.status(500).send('Internal Server Error');
  }
};

// Export the handler function
module.exports = { generatePaperworkHandler };
