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

    const isVariantRedirect = ['serbian', 'ukchina', 'zhongwen'].includes(
      service,
    );

    if (notWSServices.includes(service)) {
      return;
    }

    // Do not run the redirect tests on the local environment
    if (Cypress.env('APP_ENV') === 'local') {
      return;
    }

    const baseDomain = Cypress.env('APP_ENV') === 'test' ? 'test.' : '';

    const isVariantFrontPage = url =>
      isVariantRedirect && !url.includes('articles');

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
          const redirected = new Url(resp.redirectedToUrl);

          // it should return correct status code
          // Variant services return a 302 status (redirect found), otherwise 301 (moved permanently)
          const expectedStatus = isVariantFrontPage(urlToTest) ? 302 : 301;

          expect(resp.status).to.eq(expectedStatus);

          // it should redirect to the .com domain, if not variant front page (since we are not following the redirect)
          if (!isVariantFrontPage(urlToTest)) {
            expect(redirected.origin).to.eq(`https://www.${baseDomain}bbc.com`);
          }

          // it should match the redirected path
          const original = new Url(urlToTest);

          expect(redirected.pathname).to.contain(original.pathname);
        });
      });
    });
  });
});
