// eslint-disable no-console
const request = require('request');

const config = require('../cypress/support/config/services');

Object.keys(config).forEach(service => {
  Object.keys(config[service].pageTypes)
    .filter(pageType => config[service].pageTypes[pageType].path !== undefined)
    .forEach(pageType => {
      console.log(pageType);
      request('http://www.bbc.com/igbo', function(error, response) {
        if (!error && response.statusCode === 200) {
          console.log('Page status is OK');
        } else {
          console.log('Page status is not 200');
        }
      });
    });
});
