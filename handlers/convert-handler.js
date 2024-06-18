'use strict';

const fs = require('fs');
const path = require('path');
const url = require('url');
var parseString = require('xml2js').parseString;

const {
  writeFile,
  createDirectory,
  readScriptData,
} = require('../services/file-service');

/**
 * Adds character information to the script elements.
 *
 * @param {Array} elements - Script elements to be processed.
 * @returns {Array} - Processed script elements.
 */
const addCharacter = (elements) => {
  let currentCharacter = '';
  const el = [];
  elements.forEach((e) => {
    if (e.type === 'Transition' || e.type === 'Scene Heading' || e.type === 'Action') {
      e.character = 'NARRATOR';
      el.push(e);
    } else if (e.type === 'Character') {
      currentCharacter = e.text.toUpperCase();
    } else {
      e.character = currentCharacter;
      el.push(e);
    }
  });
  return elements;
};

/**
 * Builds a list of characters present in each scene of the script.
 *
 * @param {Array} script - Script data.
 * @returns {Array} - List of characters for each scene.
 */
const buildCharactersByScene = (script) => {
  const chars = [];
  for (let i = 0; i < script.length; i++) {
    const c = [];
    script[i].forEach((s) => {
      c.push(s.character.toUpperCase());
    });
    let uniqueArray = c.filter(function (item, pos, self) {
      return self.indexOf(item) == pos;
    });
    chars.push(uniqueArray);
  }
  return chars;
};

/**
 * Extracts text from XML structure.
 *
 * @param {Array} text - Text data from XML.
 * @returns {Array} - Extracted text.
 */
const strip = (text) => {
  let newText = '';
  text.forEach((t) => {
    if (typeof t === 'string') {
      newText += t;
    } else {
      newText += t['_'];
    }
  });
  return [newText];
};

/**
 * Handles the conversion of a script.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 */
const convertHandler = async (req, res) => {
  try {
    console.log('ENTERING CONVERT HANDLER');
    const u = url.parse(req.originalUrl, true);
    let title = u.query.script;
    const script = await readScriptData(`${title}`);
    
    // Parse XML script data
    parseString(script, async (err, result) => {
      const paragraphs = result.FinalDraft.Content[0].Paragraph;

      // Preprocess paragraphs
      paragraphs.forEach((p) => {
        if (p.Text.length > 1) {
          p.Text = strip(p.Text);
        }
        if (typeof p.Text[0] === 'object') {
          p.Text[0] = p.Text[0]['_'];
        }
        if (p.$.Type === 'Character') {
          const ptr = p.Text[0].indexOf('(');
          if (ptr !== -1) {
            p.Text[0] = p.Text[0].substring(0, p.Text[0].indexOf('(') - 1);
          }
        }
      });

      let elements = [];
      let ptr = 0;

      // Process each paragraph and create script elements
      let parenthetical = '';
      paragraphs.forEach((p) => {
        if (p.$.Type === 'Scene Heading') {
          p.Text[0] = p.Text[0].toUpperCase();
          ptr++;
        }
        if (p.$.Type === 'Parenthetical') {
          parenthetical = p.Text[0];
          parenthetical = parenthetical.substring(1);
          parenthetical = parenthetical.substring(0, parenthetical.length - 1);
        };
        if (p.$.Type !== 'Parenthetical') {
          const element = { num: ptr, type: p.$.Type, text: p.Text[0], parenthetical: parenthetical  };
          elements.push(element);
          parenthetical = '';
        }
      });
      // Add character information to the elements
      let el = addCharacter(elements);

      // Create the script structure
      const script = [];
      for (let i = 0; i <= el[el.length - 1].num; i++) {
        script.push([]);
      }

      el.forEach((e) => {
        if (e.type !== 'Character') {
          let element = {
            character: e.character,
            dialogue: e.text,
            parenthetical: e.parenthetical,
            voice: '',
            image: 'blank.jpg', 
            type: 'still',
          };
          script[e.num].push(element);
        }
      });

      // Create shot list
      let shotList = [];
      script.forEach((s, index) => {
        shotList.push({
          scene: index,
          lines: [
            {
              shot: '',
              angle: '',
              move: '',
              audio: '',
              subject: '',
              description: '',
            },
          ],
          note: '',
        });
      });

      // Create scene order
      let sceneOrder = [];
      script.forEach((s, index) => {
        sceneOrder.push(index);
      });

      // Create breakdown
      let breakdown = [];
      script.forEach((s, index) => {
        breakdown.push([['Cast Members'],['Props'],['Set Dressing'],['Costumes'],['Music'],['Sounds'],['Makeup'],['Extras'],['Stunts']]);
      });

      // Set up directories
      title = title.substring(0, title.length - 4);
      await createDirectory(title);
      await createDirectory(`${title}/vision`);
      await createDirectory(`${title}/vision/images`);
      await createDirectory(`${title}/vision/videos`);
      await createDirectory(`${title}/vision/scenes`);
      await createDirectory(`${title}/sound`);
      await createDirectory(`${title}/sound/scenes`);
      await createDirectory(`${title}/sound/sounds`);
      await createDirectory(`${title}/paperwork`);
      await createDirectory(`${title}/paperwork/breakdown`);
      await createDirectory(`${title}/paperwork/sheets`);
      await createDirectory(`${title}/paperwork/shots`);
      await createDirectory(`${title}/paperwork/ppt`);
     
      const directoryPath = path.join(__dirname, '../data');

      // Copy blank image file
      fs.copyFile(
        './blank.jpg',
        `${directoryPath}/${title}/vision/images/blank.jpg`,
        (err) => {
          if (err) throw err;
          console.log(`blank.jpg was copied to ${directoryPath}/${title}/vision/images/`
          );
        }
      );

      // Create list of characters
      const characters = [];
      script.forEach((scene) => {
        scene.forEach((s) => {
          characters.push(s.character.trim());
        });
      });

      // Remove duplicate characters
      const uniqueCharacters = characters.filter(
        (x, i) => i === characters.indexOf(x)
      );

      // Create character list
      const characterList = [];
      uniqueCharacters.forEach((c) => {
        characterList.push([c.trim(), '']);
      });

      // Create credits
      const credits = { title: title, producer: '', writer: '', director: '' };

      // Create characters by scene list
      const charactersByScene = buildCharactersByScene(script);
      const nonSpeakers = [];

      // Create FilmFox file structure
      const filmFoxFile = {
        script,
        shotList,
        sceneOrder,
        breakdown,
        credits,
        charactersByScene,
        characterList,
        nonSpeakers,
      };

      // Write FilmFox file
      await writeFile(JSON.stringify(filmFoxFile), `${title}/${title}.fff`);
    });

    // Redirect to the showreel page
    res.redirect(`/showreel?title=${title}&sceneNumber=0&elementNumber=0`);
  } catch (error) {
    // Handle errors
    console.error(`Error in convertHandler: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { convertHandler };
