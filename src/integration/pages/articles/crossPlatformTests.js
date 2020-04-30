import { runCommonCrossPlatformTests } from '../../common';

import { getMetaTagContent } from '../../common/SEO';

export default () => {
  runCommonCrossPlatformTests();

  describe('SEO', () => {
    it('Article author', () => {
      const articleAuthor = getMetaTagContent('meta[name="article:author"]');

      expect(articleAuthor).toBeTruthy();
      expect(articleAuthor).toMatchSnapshot();
    });
  });

  it('I can see the headline', () => {
    const headlineEl = document.querySelector('h1[id="content"]');

    expect(headlineEl).toBeInTheDocument();
    expect(headlineEl.textContent).toBeTruthy();
    expect(headlineEl.textContent).toMatchSnapshot();
  });

  it('I can see the timestamp', () => {
    const timestampEl = document.querySelector('time');

    expect(timestampEl).toBeInTheDocument();
    expect(timestampEl.textContent).toBeTruthy();
    expect(timestampEl.textContent).toMatchSnapshot();
  });

  it('I can see the subheadline', () => {
    const subHeadlineEl = document.querySelector('main h2');

    expect(subHeadlineEl).toBeInTheDocument();
    expect(subHeadlineEl.textContent).toBeTruthy();
    expect(subHeadlineEl.textContent).toMatchSnapshot();
  });

  it('I can see a paragraph', () => {
    const paragraphEl = document.querySelector('p');

    expect(paragraphEl).toBeInTheDocument();
    expect(paragraphEl.textContent).toBeTruthy();
    expect(paragraphEl.textContent).toMatchSnapshot();
  });

  describe('Links:', () => {
    it('I can see a link', () => {
      const linkEl = document.querySelector('main a');

      expect(linkEl).toBeInTheDocument();
      expect(linkEl.textContent).toBeTruthy();
      expect(linkEl.getAttribute('href')).toMatchSnapshot(linkEl.textContent);
    });

    const linkToAnotherArticleEl = document.querySelector(
      'a[href*="articles"]',
    );

    if (linkToAnotherArticleEl) {
      it('I can see a link to another article', () => {
        expect(linkToAnotherArticleEl).toBeInTheDocument();
        expect(linkToAnotherArticleEl.textContent).toBeTruthy();
        expect(linkToAnotherArticleEl.getAttribute('href')).toMatchSnapshot(
          linkToAnotherArticleEl.textContent,
        );
      });
    }
  });

  describe('Images:', () => {
    it('I can see an image with a caption', () => {
      const imageEl = document.querySelector(
        'main figure img, main figure amp-img',
      );
      const imageCaptionEl = document.querySelector('main figure figcaption');

      expect(imageEl).toBeInTheDocument();
      expect(imageEl).toBeTruthy();

      expect(imageCaptionEl).toBeInTheDocument();
      expect(imageCaptionEl.textContent).toBeTruthy();

      expect(imageEl.getAttribute('src')).toMatchSnapshot(
        imageCaptionEl.textContent,
      );

      // TODO: ensure no copyright (copyright holder is BBC)

        // TODO: check background image??
      /**
       * cy.get('figure div div div')
            .eq(0)
            .should(el => {
              expect(el).to.have.css(
                'background-image',
                `url("data:image/svg+xml;base64,${BBC_BLOCKS}")`,
              );
            });
       */

    });

    it('I can see an image with non-BBC copyright', () => {
      const copyrightEl = document.querySelector('main figure p[role="text"]');

      expect(copyrightEl).toBeInTheDocument();
      expect(copyrightEl).toBeTruthy();
      expect(copyrightEl.textContent).toMatchSnapshot();
    });
  });

  describe('Media Player', () => {
    const mediaPlaceholder = document.querySelector(
      'main figure div[class^="StyledVideoContainer"]',
    );

    it('I can see a placeholder', () => {
      expect(mediaPlaceholder).toBeInTheDocument();
    });

    it('I can see a caption below the placeholder', () => {
      const captionEl = mediaPlaceholder.parentElement.querySelector(
        'figcaption',
      );
      expect(captionEl).toBeInTheDocument();
      expect(captionEl.textContent).toBeTruthy();
      expect(captionEl.textContent).toMatchSnapshot();
    });
  });
};
