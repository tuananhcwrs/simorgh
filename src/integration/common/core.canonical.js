export default () => {
  it('Bundle scripts', () => {
    const bundleScriptMatcher = new RegExp(
      `(\\/static\\/js\\/(main|vendor|${global.service})-\\w+\\.\\w+\\.js)`,
      'g',
    );
    const bbcOriginScripts = Array.from(
      document.querySelectorAll('script[src]'),
    ).filter(script =>
      script.getAttribute('src').startsWith('http://localhost:7080'),
    );

    bbcOriginScripts.forEach(bbcOriginScript => {
      expect(bbcOriginScript.getAttribute('src')).toMatch(bundleScriptMatcher);
    });
  });

  it('Service bundle is loaded', () => {
    const bundleScriptMatcher = new RegExp(
      `(\\/static\\/js\\/(${global.service})-\\w+\\.\\w+\\.js)`,
      'g',
    );
    const bbcOriginScripts = Array.from(
      document.querySelectorAll('script[src]'),
    ).filter(script =>
      script.getAttribute('src').startsWith('http://localhost:7080'),
    );
    const serviceScripts = bbcOriginScripts.filter(script =>
      bundleScriptMatcher.test(script.getAttribute('src')),
    );

    expect(serviceScripts.length).toBe(1);
  });

  it('SEO AMP HTML', () => {
    const ampHTMLLink = document.querySelector('head link[rel="amphtml"]');

    expect(ampHTMLLink).toBeInTheDocument();
    expect(ampHTMLLink.getAttribute('href')).toBeTruthy();
    expect(ampHTMLLink.getAttribute('href')).toMatchSnapshot();
  });

  it('AMP attribute should not exist', () => {
    const htmlEl = document.querySelector('html');

    expect(htmlEl.getAttribute('amp')).toBeNull();
  });
};
