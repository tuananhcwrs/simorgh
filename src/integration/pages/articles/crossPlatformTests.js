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

  it('I can see an inline link', () => {
    const linkEl = document.querySelector('main a');

    expect(linkEl).toBeInTheDocument();
    expect(linkEl.textContent).toBeTruthy();
    expect(linkEl.getAttribute('href')).toMatchSnapshot(linkEl.textContent);
  });

  it('I can see an image with a caption', () => {
    const imageEl = document.querySelector(
      'main figure img, main figure amp-img',
    );
    const imageCaptionEl = document.querySelector('main figure figcaption');

    expect(imageEl).toBeInTheDocument();
    expect(imageEl).toBeTruthy();
    expect(imageEl.getAttribute('src')).toMatchSnapshot();

    expect(imageCaptionEl).toBeInTheDocument();
    expect(imageCaptionEl.textContent).toBeTruthy();
    expect(imageCaptionEl.textContent).toMatchSnapshot();
  });

  it('I can see an image with non-BBC copyright', () => {
    const copyrightEl = document.querySelector('main figure p[role="text"]');

    expect(copyrightEl).toBeInTheDocument();
    expect(copyrightEl).toBeTruthy();
    expect(copyrightEl.textContent).toMatchSnapshot();
  });
};
