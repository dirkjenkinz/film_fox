'use strict';

// Import necessary modules and dependencies
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const voice = require('elevenlabs-node');

// Constants for directory paths and API URLs
const directoryPath = path.join(__dirname, '../data');
const ELEVENLABS_API_BASE_URL = 'https://api.elevenlabs.io/v1';

// Function to get sample IDs for a given voice
const getSampleIds = async (voice_id, apiKey) => {
  console.log('Getting sample IDs');
  const config = {
    headers: {
      accept: 'application/json',
      'xi-api-key': apiKey,
    },
  };

  try {
    const response = await axios.get(`${ELEVENLABS_API_BASE_URL}/v2/voices/${voice_id}`, config);
    return response.data;
  } catch (error) {
    console.error('Error getting sample IDs:', error.message);
    return '';
  }
};

// Function to get a voice sample for a given sample ID
const getVoiceSample = async (voice_id, sample_id, apiKey) => {
  console.log('Getting voice sample');
  const config = {
    headers: {
      accept: 'application/json',
      'xi-api-key': apiKey,
    },
  };

  try {
    const response = await axios.get(`${ELEVENLABS_API_BASE_URL}/v1/voices/${voice_id}/samples/${sample_id}/audio`, config);
    return response.data.voices;
  } catch (error) {
    console.error('Error getting voice sample:', error.message);
    return '';
  }
};

// Function to generate a voice sample for a given voice ID
const generateSample = async (voiceID, apiKey) => {
  console.log('Generating sample');
  try {
    await voice.textToSpeech(
      apiKey,
      voiceID,
      `${directoryPath}/samples/${voiceID}.mp3`,
      'Now is the winter of our discontent made glorious summer by this son of York.'
    );
    console.log(`Sound sample generated for ${voiceID}`);
    return 'Generated';
  } catch (error) {
    console.error('Error generating speech:', error.message);
    return 'Failed';
  }
};

// Function to generate speech using the Eleven Labs API
const generateSpeech = async (apiKey, voiceID, fileName, textInput, title) => {
  try {
    // Check if required parameters are provided
    if (!apiKey || !voiceID || !fileName || !textInput) {
      throw new Error('Missing parameter');
    }

    const voiceURL = `${ELEVENLABS_API_BASE_URL}/text-to-speech/${voiceID}`; // Full URL for generating speech
    const filePath = path.join(directoryPath, title, 'sound', 'sounds', fileName);
    console.log(`Posting generate speech request for ${fileName}`);
    // Make a POST request to generate speech
    const response = await axios({
      method: 'POST',
      url: voiceURL,
      data: {
        text: textInput,
        voice_settings: {
          stability: 0,
          similarity_boost: 0,
        },
        model_id: 'eleven_monolingual_v1',
      },
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      responseType: 'stream',
    });

    // Pipe the response data to create a local audio file
    response.data.pipe(fs.createWriteStream(filePath));

    return { status: 'ok' };
  } catch (error) {
    console.error('Error in generateSpeech:', error.message);
    throw error;
  }
};

// Function to get available voices from the Eleven Labs API
const getVoices = async (apiKey) => {
  console.log('Getting voices');
  const config = {
    headers: {
      accept: 'application/json',
      'xi-api-key': apiKey,
    },
  };

  try {
    const response = await axios.get(`${ELEVENLABS_API_BASE_URL}/voices`, config);
    return response.data.voices;
  } catch (error) {
    console.error('Error getting voices:', error.message);
    return '';
  }
};

// Function to get subscription information for a user
const getUserSubscriptionInfo = async (apiKey) => {
  console.log('Getting user subscription information');
  const config = {
    headers: {
      accept: 'application/json',
      'xi-api-key': apiKey,
    },
  };

  try {
    const response = await axios.get(`${ELEVENLABS_API_BASE_URL}/user/subscription`, config);
    return JSON.stringify(response.data, null, 4);
  } catch (error) {
    console.error('Error getting subscription details:', error.message);
    return '';
  }
};

// Export the functions for external use
module.exports = {
  generateSpeech,
  getVoices,
  getVoiceSample,
  getUserSubscriptionInfo,
  getSampleIds,
  generateSample,
};
