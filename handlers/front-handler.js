'use strict';

const { getFileList, writeFile, getFile, getFFFList } = require('../services/file-service');
const { getUserSubscriptionInfo, getVoices } = require('../services/elevenLabs');

// Handler for rendering the front page
const frontHandler = async (req, res) => {
  try {
    // Log entry point for better traceability
    console.log('ENTERING FRONT HANDLER');

    // Get the ElevenLabs API key
    const { apiKey } = await getFile('control.json');

    // Fetch the list of FFF (Film Fox Files) and FDX (Final Draft) files
    const fffFiles = await getFFFList();
    const fdxFiles = await getFileList('scripts', 'fdx');

    // Initialize variables
    let subscription = '';
    let resetDate = '';
    let paymentDate = '';
    let voices = '';

    // Check if an ElevenLabs API key is available
    if (apiKey) {
      // Fetch user subscription information from ElevenLabs
      subscription = await getUserSubscriptionInfo(apiKey);
      
      // Process subscription information for non-free tiers
      if (subscription) {
        subscription = JSON.parse(subscription);
        if (subscription.tier !== 'free') {
          resetDate = new Date(subscription.next_character_count_reset_unix * 1000);
          paymentDate = new Date(subscription.next_invoice.next_payment_attempt_unix * 1000);
          subscription.next_character_count_reset = resetDate.toLocaleString();
          subscription.next_invoice.next_payment_attempt = paymentDate.toLocaleString();
        }
      }

      // Fetch available voices from ElevenLabs and save to 'voices.json' file
      voices = await getVoices(apiKey);
      await writeFile(JSON.stringify(voices), 'voices.json');
    }

    // Check which FDX files have corresponding FFF files
    const converted = fdxFiles.map(file => fffFiles.includes(file.substring(0, file.length - 4)) ? 'y' : 'n');

    // Render the 'front' template with relevant data
    res.render('front.njk', {
      api_key: apiKey,
      fffList: fffFiles,
      fdxList: fdxFiles,
      subscription,
      converted,
    });
  } catch (error) {
    // Handle errors
    console.error(`Error in frontHandler: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
};

// Export the frontHandler function for use in other modules
module.exports = { frontHandler };
