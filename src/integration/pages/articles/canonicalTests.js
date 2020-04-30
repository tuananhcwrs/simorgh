import {
  runCoreCanonicalTests,
  runCanonicalAnalyticsTests,
} from '../../common';

export default () => {
  runCoreCanonicalTests();
  runCanonicalAnalyticsTests();

  describe('Media Player', () => {
    const mediaPlaceholder = document.querySelector(
      'main figure div[class^="StyledVideoContainer"]',
    );

    it('I can see a play button with guidance, video caption and duration', () => {
      const playButtonEl = mediaPlaceholder.querySelector('button span');
      expect(playButtonEl).toBeInTheDocument();
      expect(playButtonEl.textContent).toBeTruthy();
      expect(playButtonEl.textContent).toMatchSnapshot();
    });
  });
};
