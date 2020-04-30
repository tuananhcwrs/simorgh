import appToggles from '../../../support/helpers/useAppToggles';
import { getBlockByType, getBlockData } from './helpers';

// TODO: Remove once we have inline link on article pages linking to another article page
const serviceHasInlineLink = service => service === 'news';

// For testing important features that differ between services, e.g. Timestamps.
// We recommend using inline conditional logic to limit tests to services which differ.
export const testsThatAlwaysRun = () => {};

// For testing feastures that may differ across services but share a common logic e.g. translated strings.
export const testsThatFollowSmokeTestConfig = ({ service, pageType }) => {
  describe(`Running tests for ${service} ${pageType}`, () => {
    describe(`Article Body`, () => {

      // `appToggles` tells us whether a feature is toggled on or off in the current environment.
      if (appToggles.mediaPlayer.enabled) {
        describe('Media Player', () => {
          it('should have a visible caption beneath a mediaplayer', () => {
            cy.request(`${Cypress.env('currentPath')}.json`).then(
              ({ body }) => {
                const media = getBlockData('video', body);
                if (media) {
                  const captionBlock = getBlockByType(
                    media.model.blocks,
                    'caption',
                  );

                  if (captionBlock) {
                    const {
                      text,
                    } = captionBlock.model.blocks[0].model.blocks[0].model;

                    cy.get('figcaption')
                      .eq(1)
                      .within(() => {
                        cy.get('p')
                          .eq(0)
                          .should('be.visible')
                          .should('contain', text);
                      });
                  }
                }
              },
            );
          });
        });
      }
    });
  });
};

// For testing low priority things e.g. cosmetic differences, and a safe place to put slow tests.
export const testsThatNeverRunDuringSmokeTesting = () => {};
