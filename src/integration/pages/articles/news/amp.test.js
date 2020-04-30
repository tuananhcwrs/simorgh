/**
 * @service news
 * @pathname /news/articles/cn7k01xp8kxo
 */

import runCrossPlatformTests from '../crossPlatformTests';
import runAmpTests from '../ampTests';

describe('AMP', () => {
  describe(pageType, () => {
    runCrossPlatformTests();
    runAmpTests();
  });
});
