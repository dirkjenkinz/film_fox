'use strict';

const url = require('url');
const { getFile } = require('../../services/file-service');

/**
 * Handles requests related to categories.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const categoriesHandler = async (req, res) => {
  try {
    // Log entering the categories handler
    console.log('ENTERING CATEGORIES HANDLER');

    // Parse the URL to extract query parameters
    const parsedUrl = url.parse(req.originalUrl, true);
    const title = parsedUrl.query.title;
    const sceneNumber = parsedUrl.query.sceneNumber;
    const elementNumber = parsedUrl.query.elementNumber;

    // Retrieve film file and necessary data
    const filmFoxFile = await getFile(`${title}/${title}.fff`);
    let category = parsedUrl.query.category;
    let { breakdown } = filmFoxFile;

    // Initialize categories array
    const categories = breakdown[0].map(b => [b[0], 'n']);

    // Create a list to store scenes and their associated categories
    const list = breakdown.reduce((acc, categories, index) => {
      const temp = [index];
      categories.forEach((c) => {
        if (c.length > 1) {
          temp.push(c);
        }
      });
      if (temp.length > 1) {
        acc.push(temp);
      }
      return acc;
    }, []);

    // Update categories array based on the scenes and their associated categories
    list.forEach((scene) => {
      scene.forEach((s) => {
        categories.forEach((c) => {
          if (c[0] === s[0]) {
            c[1] = 'y';
          }
        });
      });
    });


    let displayList = [];

    list.forEach((scene) => {
      scene.forEach((item) => {
        if (item[0] === category){
          displayList.push([scene[0], item]);
        }
      });
    });
    
    // Render the categories template with necessary data
    res.render('paperwork/categories.njk', {
      title,
      sceneNumber,
      elementNumber,
      categories,
      list,
      category: category || '',
      displayList,
      page: 'Categories',
      caller: 'categories',
    });
  } catch (error) {
    // Handling errors and sending a 500 Internal Server Error response
    console.error(`Error in categoriesHandler: ${error}`);
    res.status(500).send('Internal Server Error');
  }
};

// Export the handler function
module.exports = { categoriesHandler };
