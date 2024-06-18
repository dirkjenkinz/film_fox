// routes.js
const express = require('express');

// Reusable function to create routes dynamically
function createRouter(handler) {
  const router = express.Router();
  router.get('/', handler);
  return router;
}

module.exports = createRouter;
