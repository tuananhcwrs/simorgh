import { runCoreAmpTests, runMediaPlayerEmbedTests } from '../../common';

export default () => {
  runCoreAmpTests();
  runMediaPlayerEmbedTests();

  describe('Media player', () => {
    it('should render a placeholder image', () => {
      const mediaPlaceholderImage = document.querySelector(
        'amp-iframe amp-img',
      );

      expect(mediaPlaceholderImage).toBeInTheDocument();
      expect(mediaPlaceholderImage.getAttribute('src')).toBeTruthy();
      expect(mediaPlaceholderImage.getAttribute('src')).toMatchSnapshot();
    });
  });
};
