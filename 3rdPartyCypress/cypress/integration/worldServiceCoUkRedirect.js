import Url from 'url-parse';
import services from '../../../src/server/utilities/serviceConfigs';

describe('WS Redirects', () => {
  Object.keys(services).forEach(service => {
    const notWSServices = [
      'news',
      'cymrufyw',
      'naidheachdan',
      'default',
      'scotland',
      'archive',
    ]; // Not WS

    const servicesWtithVariantRedirect = ['serbian', 'ukchina', 'zhongwen'];

    if ([...notWSServices, ...servicesWtithVariantRedirect].includes(service)) {
      return;
    }

    // Do not run the redirect tests on the local environment
    if (Cypress.env('APP_ENV') === 'local') {
      return;
    }

    const baseDomain = Cypress.env('APP_ENV') === 'test' ? 'test.' : '';

    it(`www.${baseDomain}bbc.co.uk/${service} should redirect to www.${baseDomain}bbc.com/${service}`, () => {
      const urlsTotest = [
        `https://www.${baseDomain}bbc.co.uk/${service}`,
        `https://www.${baseDomain}bbc.co.uk/${service}/articles/a0000000000o`,
        `https://www.${baseDomain}bbc.co.uk/${service}/articles/a0000000000o.amp`,
      ];

      urlsTotest.forEach(urlToTest => {
        cy.request({
          url: urlToTest,
          followRedirect: false,
        }).then(resp => {
          expect(resp.status).to.eq(301);
          const redirected = new Url(resp.redirectedToUrl);
          expect(redirected.origin).to.eq(`https://www.${baseDomain}bbc.com`);

          const original = new Url(urlToTest);
          // expect redirected path to the same as the url under test
          expect(original.pathname).to.eq(redirected.pathname);
        });
      });
    });
  });
});
