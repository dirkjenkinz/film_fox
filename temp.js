// Importing required modules
const axios = require('axios');
const { v4: uuid } = require('uuid');
// Jest is being used for testing, unmocking prom-client
jest.unmock('prom-client');

// Setting up the default port
const PORT = process.env.PORT || 3030;

// Setting up local URLs for testing
process.env.CIS_URL = 'http://localhost:3020/cis/get/';
process.env.PIP_URL = 'http://localhost:3010/';
process.env.IAG_URL = 'http://localhost:3040/';

// Function to use deployed configuration if in deployed test mode
async function useDeployedConfiguration() {
  if (process.env.TEST_MODE === 'deployed') {
    process.stdout.write('\x1b[35mUSING deployed TEST MOCKS\x1b[0m\n');
    process.env.CIS_URL = 'https://cis-kbv.stubs.test.shefcon-dev.dwpcloud.uk/cis/get/';
    process.env.PIP_URL = 'https://pip-kbv.stubs.test.shefcon-dev.dwpcloud.uk/';
    process.env.IAG_URL = 'https://iag-kbv.stubs.test.shefcon-dev.dwpcloud.uk/';
    // Checking if HTTPS is working
    await axios({ url: process.env.IAG_URL }).catch(() => undefined);
  }
}

// Setting up default timeouts and other environment variables
process.env.IAG_REQUEST_TIMEOUT = '10000';
process.env.IAG_RETRIEVE_TIMEOUT = '10000';
process.env.IAG_RETRY_COUNT = '5';
process.env.IAG_RETRY_TIME = '1000';
process.env.IAG_FLAG = 'on';
process.env.INT_SUFFIX = '-shared';
process.env.IAG_API_KEY = 'iagApiKey';

let server;

// Starting the KBV service
function startKBVService() {
  const app = require('../app/app'); // eslint-disable-line global-require
  return new Promise((resolve, reject) => {
    server = app.listen(PORT, () => resolve());
    server.on('error', (error) => reject(error));
  });
}

// Function to wait for a specified time
async function waitFor(t) {
  return new Promise((resolve) => setTimeout(() => resolve(), t));
}

// Function to make HTTP requests
function request(method, url, data, headers, options) {
  return axios({
    method,
    url,
    headers,
    data,
    ...options,
  })
    .catch((error) => { // Handling common HTTP errors
      if (error.response) {
        return error.response;
      }
      throw error;
    });
}

// Function to make a retrieve call
async function callRetrieve(nino, headers, setDefaultHeaders = true) {
  const url = `http://localhost:${PORT}/retrieve`;
  const data = { nino };
  const head = (setDefaultHeaders) ? {
    'x-session-id': uuid(),
    'x-correlation-id': uuid(),
    'x-client-id': 'CxP-ESA-TIDV',
    ...headers,
  } : headers;

  process.stdout.write(`\x1b[36m==== ESA_REQUEST: ${nino} ${head['x-session-id']} ====\x1b[0m\n`);
  return request('POST', url, data, head);
}

// Function to make a data-items call
async function callDataItems(nino, headers, setDefaultHeaders = true) {
  const url = `http://localhost:${PORT}/data-items`;
  const data = {
    nino,
    channel: 'phone',
    items: 1,
  };
  const head = (setDefaultHeaders) ? {
    'x-session-id': uuid(),
    'x-correlation-id': uuid(),
    'x-client-id': 'CxP-ESA-TIDV',
    ...headers,
  } : headers;

  if (head['x-client-id'] === false) {
    delete head['x-client-id'];
  }

  process.stdout.write(`\x1b[36m==== DATA_ITEMS: ${nino} ${head['x-session-id']} ${head['x-client-id']} ====\x1b[0m\n`);
  return request('POST', url, data, head);
}

// Function to test ESA data
async function testESA(nino, delay) {
  const d = await callDataItems(nino);
  expect(d.data.sources[1]).toEqual({
    sourceId: 'esa',
    fields: [{
      fieldId: 'esa_request_id',
      verifiedValue: 'esa',
    }],
    iagTriggered: true,
  });
  await waitFor(delay);
  const headers = {
    'x-session-id': d.config.headers['x-session-id'],
  };
  return callRetrieve(nino, headers);
}

// Function to match fields in responses
function expectFieldMatch(fields, values) {
  if (!fields[0]) {
    throw new Error('No field returned');
  }
  const key = fields[0].fieldId;
  const value = fields[0].verifiedValue;
  expect(`${key}:${value}`).toEqual(`${key}:${values[key]}`);
}

// Integration tests
describe('Integration Tests', () => {
  jest.setTimeout(40000);

  beforeAll(async () => {
    await useDeployedConfiguration();
    await startKBVService();
  });

  afterAll(() => {
    if (server) {
      server.close();
    }
  });

  // Test cases for data-items
  test('test data-items ESA MW000689A', async () => {
    // Test for ESA data with MW000689A NINO
    const r = await callDataItems('MW000689A', { 'x-client-id': 'CxP-PIP-TIDV' });
    const { sources } = r.data;
    expectFieldMatch(sources[0].fields, {
      cis_partners_nino: 'MW000697A',
      cis_benefit: '670,85',
      cis_partners_dob: '1980-11-11',
      cis_mobile_phone: '9876534567',
      cis_home_phone: '9876534567',
    });
    expect(sources[0].awards).toEqual(['670', '85']);
    expect(sources[1]).toEqual({
      sourceId: 'esa',
      fields: [{
        fieldId: 'esa_request_id',
        verifiedValue: 'esa',
      }],
      iagTriggered: true,
    });
  });

  // More test cases...
});