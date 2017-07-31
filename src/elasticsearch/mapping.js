
import express from 'express';
import fs from 'fs';

const router = express.Router();
const searchIndexDir = __dirname + "\\routes\\";

const execute = [];

// Read each file in the routes directory
fs.readdirSync(searchIndexDir).forEach(function (route) {
  // Strip the .js suffix
  route = route.split('.')[0];
  // Ignore index (i.e. this file)
  if (route === 'index' || execute.indexOf(route) !== -1) return;
  console.log('Loading route ' + route + '...');
  // Mount router
  router.use('/' + route, require(searchIndexDir + route + '.js'));
});

module.exports = router;
