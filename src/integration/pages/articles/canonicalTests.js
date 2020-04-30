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

  describe('Images:', () => {
    it('I can see an image which is not lazy-loaded', () => {
      const imageEl = document.querySelector(
        'main figure div[class^="ImagePlaceholder"] img',
      );

      expect(imageEl).toBeInTheDocument();

      const noScriptEl = imageEl.parentElement.querySelector('noscript');
      expect(noScriptEl).toBeNull();
    });

    it('I can see an image placeholder which is lazy-loaded', () => {
      const lazyLoadedImageEl = document.querySelector(
        'main figure div[class="lazyload-placeholder"]',
      );

      expect(lazyLoadedImageEl).toBeInTheDocument();

      const imageEl = lazyLoadedImageEl.parentElement.querySelector('noscript');
      expect(imageEl).toBeInTheDocument();
      expect(imageEl.innerHTML).toContain('<img');
    });
  });
};
