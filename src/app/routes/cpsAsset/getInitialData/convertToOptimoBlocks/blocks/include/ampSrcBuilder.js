import Url from 'url-parse';

const ampSrcBuilder = href => {
  // TODO... how to deal with localhost? SIMORGH_INCLUDES_BASE_AMP_URL=https://news.test.files.bbci.co.uk into envConfig/local.env??
  if (
    process.env.SIMORGH_PUBLIC_STATIC_ASSETS_ORIGIN === 'http://localhost:7080'
  ) {
    process.env.SIMORGH_PUBLIC_STATIC_ASSETS_ORIGIN =
      'https://news.test.files.bbci.co.uk';
  }
  const ampSrcPrefix = process.env.SIMORGH_PUBLIC_STATIC_ASSETS_ORIGIN;
  const includePathname = new Url(href, true).pathname;
  const includeQueryString = new Url(href, false).query;

  return `${ampSrcPrefix + includePathname}/amp${includeQueryString}`;
};

export default ampSrcBuilder;
