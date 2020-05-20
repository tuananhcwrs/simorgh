/* eslint-disable no-underscore-dangle */
/* eslint-disable array-callback-return */
/* eslint-disable no-console */
const fetch = require('node-fetch');
const { grey, green, red } = require('chalk');

const args = process.argv.slice(2);
const environment = args[0];

global.Cypress = {
  env: param => {
    switch (param) {
      case 'APP_ENV':
        return environment;
      default:
        return 'test';
    }
  },
};

const serviceHasPageType = require('../../cypress/support/helpers/serviceHasPageType');
const getPaths = require('../../cypress/support/helpers/getPaths');
const services = require('../../cypress/support/config/services');
const environmentConfig = require('../../cypress/support/config/envs');

const getUrls = () => {
  const urls = [];
  Object.keys(services).forEach(serviceId => {
    const { pageTypes } = services[serviceId];
    Object.keys(pageTypes)
      .filter(pageType => serviceHasPageType(serviceId, pageType))
      .forEach(pageType => {
        const paths = getPaths(serviceId, pageType);

        paths.forEach(async path => {
          const { baseUrl } = environmentConfig;
          urls.push(`${baseUrl}${path}`);
        });
      });
  });

  return urls;
};

const checkUrls = async () => {
  const urlsWithFallback = [];
  const errorMessages = [];

  await Promise.allSettled(
    getUrls().map(url => fetch(url, { method: 'HEAD' })),
  ).then(responses => {
    responses.map(response => {
      if (response.value) {
        const { url, status, headers } = response.value;
        if (status === 200) {
          if (headers._headers['x-mfa']) {
            urlsWithFallback.push(url);
          } else {
            console.log(green(`✓ ${url}`));
          }
        } else {
          errorMessages.push(red(`✗ ${url} returned ${status} status`));
        }
      } else {
        errorMessages.push(grey(`✗ ${JSON.stringify(response.reason)}`));
      }
    });
  });

  return { urlsWithFallback, errorMessages };
};

const run = async () => {
  const { urlsWithFallback, errorMessages } = await checkUrls();

  if (urlsWithFallback.length > 0) {
    console.error(
      `\nFallbacks detected: \n\n${red(urlsWithFallback.join('\n'))}`,
    );
    process.exit(1);
  }

  if (errorMessages.length > 0) {
    console.error(`\nErrors: \n\n${red(errorMessages.join('\n'))}`);
  }
};

run();
