const envConfig = require('../support/config/envs');

/* eslint-disable no-param-reassign */
module.exports = (on, config) => {
  config.baseUrl = envConfig(config.env.APP_ENV, config.env.UK).baseUrl;
  config.chromeWebSecurity = envConfig(
    config.env.APP_ENV,
    config.env.UK,
  ).chromeWebSecurity;

  return config;
};
