const getPaths = require('./getPaths');

module.exports = (service, pageType) => {
  return getPaths(service, pageType).length > 0;
};
