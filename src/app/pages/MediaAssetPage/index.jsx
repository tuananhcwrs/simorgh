import React, { useContext } from 'react';
import path from 'ramda/src/path';
import styled from 'styled-components';
import {
  GEL_SPACING_DBL,
  GEL_SPACING_TRPL,
  GEL_SPACING_QUAD,
} from '@bbc/gel-foundations/spacings';

import { GEL_GROUP_4_SCREEN_WIDTH_MIN } from '@bbc/gel-foundations/breakpoints';

import pathOr from 'ramda/src/pathOr';
import MediaMessage from './MediaMessage';
import { getImageParts } from '#app/routes/cpsAsset/getInitialData/convertToOptimoBlocks/blocks/image/helpers';
import CpsMetadata from '#containers/CpsMetadata';
import LinkedData from '#containers/LinkedData';
import headings from '#containers/Headings';
import Timestamp from '#containers/ArticleTimestamp';
import text from '#containers/CpsText';
import image from '#containers/Image';
import ChartbeatAnalytics from '#containers/ChartbeatAnalytics';
import VideoPlayer from '../OnDemandTvPage/VideoPlayer';
import Blocks from '#containers/Blocks';
import Grid, { GelPageGrid } from '#app/components/Grid';
import CpsRelatedContent from '#containers/CpsRelatedContent';
import ATIAnalytics from '#containers/ATIAnalytics';
import cpsAssetPagePropTypes from '../../models/propTypes/cpsAssetPage';
import fauxHeadline from '#containers/FauxHeadline';
import visuallyHiddenHeadline from '#containers/VisuallyHiddenHeadline';
import {
  getFirstPublished,
  getLastPublished,
  getAboutTags,
} from '#lib/utilities/parseAssetData';

import { RequestContext } from '#contexts/RequestContext';
import { ServiceContext } from '../../contexts/ServiceContext';

const isLegacyMediaAssetPage = url => url.split('/').length > 7;

const MediaAssetPage = ({ pageData }) => {
  const requestContext = useContext(RequestContext);
  const { lang, dir } = useContext(ServiceContext);
  const title = path(['promo', 'headlines', 'headline'], pageData);
  const summary = path(['promo', 'summary'], pageData);
  const metadata = path(['metadata'], pageData);
  const allowDateStamp = path(['options', 'allowDateStamp'], metadata);
  const assetUri = path(['locators', 'assetUri'], metadata);
  const blocks = pathOr([], ['content', 'model', 'blocks'], pageData);
  const relatedContent = pathOr(
    [],
    ['relatedContent', 'groups', 0, 'promos'],
    pageData,
  );
  const indexImagePath = path(['promo', 'indexImage', 'path'], pageData);
  const indexImageLocator = indexImagePath
    ? getImageParts(indexImagePath)[1]
    : null;
  const indexImageAltText = path(['promo', 'indexImage', 'altText'], pageData);
  const firstPublished = getFirstPublished(pageData);
  const lastPublished = getLastPublished(pageData);
  const aboutTags = getAboutTags(pageData);

  const assetId = assetUri.substr(1);

  const versionId = path(
    ['promo', 'media', 'versions', 0, 'versionId'],
    pageData,
  );
  // const blockId = path(
  //   ['model', 'blocks', 0, 'model', 'blockId'],
  //   aresMediaBlock,
  // );

  const mediaId = `${assetId}/${versionId}/${lang}`;

  const componentsToRender = {
    fauxHeadline,
    visuallyHiddenHeadline,
    headline: headings,
    subheadline: headings,
    text,
    image,
    timestamp: props =>
      allowDateStamp ? (
        <StyledTimestamp {...props} popOut={false} minutesTolerance={1} />
      ) : null,

    // There are niche scenarios where we receive legacy MAPs that contain modern video blocks
    // This is not something we currently support, so we return an error message
    video: isLegacyMediaAssetPage(requestContext.canonicalLink)
      ? MediaMessage
      : () => <VideoPlayer mediaId={mediaId} assetId={assetId} type="cps" />,

    legacyMedia: () => (
      <VideoPlayer mediaId={mediaId} assetId={assetId} type="cps" />
    ),

    // "Versions" are live streams
    version: () => (
      <VideoPlayer mediaId={mediaId} assetId={assetId} type="cps" />
    ),
    unavailableMedia: MediaMessage,
  };

  const StyledTimestamp = styled(Timestamp)`
    padding-bottom: ${GEL_SPACING_DBL};

    @media (min-width: ${GEL_GROUP_4_SCREEN_WIDTH_MIN}) {
      padding-bottom: ${GEL_SPACING_TRPL};
    }
  `;

  const StyledGelWrapperGrid = styled.div`
    padding-top: ${GEL_SPACING_TRPL};
  `;

  const getGroups = (zero, one, two, three, four, five) => ({
    group0: zero,
    group1: one,
    group2: two,
    group3: three,
    group4: four,
    group5: five,
  });

  const StyledGelPageGrid = styled(GelPageGrid)`
    padding-bottom: ${GEL_SPACING_QUAD};
    width: 100%;
    flex-grow: 1; /* needed to ensure footer positions at bottom of viewport */
  `;

  return (
    <>
      <ChartbeatAnalytics data={pageData} />
      <CpsMetadata
        title={title}
        language={metadata.language}
        description={summary}
        firstPublished={firstPublished}
        lastPublished={lastPublished}
        imageLocator={indexImageLocator}
        imageAltText={indexImageAltText}
        aboutTags={aboutTags}
      />
      <LinkedData
        type="Article"
        seoTitle={title}
        headline={title}
        showAuthor
        datePublished={firstPublished}
        dateModified={lastPublished}
        aboutTags={aboutTags}
      />
      <ATIAnalytics data={pageData} />
      <StyledGelPageGrid
        forwardedAs="main"
        role="main"
        dir={dir}
        columns={getGroups(6, 6, 6, 6, 8, 20)}
        enableGelGutters
      >
        <Grid
          item
          dir={dir}
          startOffset={getGroups(1, 1, 1, 1, 2, 5)}
          columns={getGroups(6, 6, 6, 6, 6, 12)}
          margins={getGroups(true, true, true, true, false, false)}
        >
          <StyledGelWrapperGrid
            columns={getGroups(6, 6, 6, 6, 6, 6)}
            enableGelGutters
          >
            <Blocks blocks={blocks} componentsToRender={componentsToRender} />
          </StyledGelWrapperGrid>
        </Grid>
      </StyledGelPageGrid>
      <CpsRelatedContent content={relatedContent} />
    </>
  );
};

MediaAssetPage.propTypes = cpsAssetPagePropTypes;

export default MediaAssetPage;
