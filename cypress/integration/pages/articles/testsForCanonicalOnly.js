import appConfig from '../../../../src/server/utilities/serviceConfigs';
import envConfig from '../../../support/config/envs';
import appToggles from '../../../support/helpers/useAppToggles';
import { getBlockData, getVideoEmbedUrl } from './helpers';

// For testing important features that differ between services, e.g. Timestamps.
// We recommend using inline conditional logic to limit tests to services which differ.
export const testsThatAlwaysRunForCanonicalOnly = () => {};

// For testing feastures that may differ across services but share a common logic e.g. translated strings.
export const testsThatFollowSmokeTestConfigForCanonicalOnly = ({
  service,
  pageType,
  variant,
}) =>
  describe(`Canonical Tests for ${service} ${pageType}`, () => {
    it('should not have an AMP attribute on the main article', () => {
      cy.get('html').should('not.have.attr', 'amp');
    });

    if (appToggles.chartbeatAnalytics.enabled) {
      describe('Chartbeat', () => {
        if (envConfig.chartbeatEnabled) {
          it('should have a script with src value set to chartbeat source', () => {
            cy.hasScriptWithChartbeatSrc();
          });
          it('should have chartbeat config set to window object', () => {
            cy.hasGlobalChartbeatConfig();
          });
        }
      });
    }

    // `appToggles` tells us whether a feature is toggled on or off in the current environment.
    if (appToggles.mediaPlayer.enabled) {
      describe('Media Player: Canonical', () => {
        // temporarily disable this test until this issue is completed to investigate it:
        // https://github.com/bbc/simorgh-infrastructure/issues/983
        it.skip('should render an iframe with a valid URL when a user clicks play', () => {
          cy.window().then(win => {
            const body = win.SIMORGH_DATA.pageData;
            const media = getBlockData('video', body);

            if (media && media.type === 'video') {
              const { lang } = appConfig[service][variant];
              const embedUrl = getVideoEmbedUrl(body, lang);
              cy.get(
                'div[class*="StyledVideoContainer"] button[class*="StyledPlayButton"]',
              )
                .click()
                .then(() => {
                  cy.get(`iframe[src="${embedUrl}"]`).should('be.visible');
                });
              cy.testResponseCodeAndType(embedUrl, 200, 'text/html');
            }
          });
        });
      });
    }
  });

// For testing low priority things e.g. cosmetic differences, and a safe place to put slow tests.
export const testsThatNeverRunDuringSmokeTestingForCanonicalOnly = () => {};
