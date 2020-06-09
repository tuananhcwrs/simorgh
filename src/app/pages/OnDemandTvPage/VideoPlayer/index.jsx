import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import {
  GEL_SPACING_DBL,
  GEL_SPACING_TRPL,
  GEL_SPACING_QUAD,
} from '@bbc/gel-foundations/spacings';
import { GEL_GROUP_2_SCREEN_WIDTH_MAX } from '@bbc/gel-foundations/breakpoints';
import { string, bool } from 'prop-types';

import {
  CanonicalMediaPlayer,
  AmpMediaPlayer,
  MediaMessage,
} from '@bbc/psammead-media-player';
import pathOr from 'ramda/src/pathOr';
import { RequestContext } from '#contexts/RequestContext';
import { ServiceContext } from '#contexts/ServiceContext';
import getEmbedUrl from '#lib/utilities/getEmbedUrl';
import getPlaceholderImageUrl from '../../../routes/utils/getPlaceholderImageUrl';

const StyledWrapper = styled.div`
  margin-top: ${GEL_SPACING_TRPL};
  @media (max-width: ${GEL_GROUP_2_SCREEN_WIDTH_MAX}) {
    width: calc(100% + ${GEL_SPACING_QUAD});
    margin: 0 -${GEL_SPACING_DBL};
  }
`;

const landscapeRatio = '56.25%'; // (9/16)*100 = 16:9
const StyledMessageContainer = styled.div`
  margin-top: ${GEL_SPACING_TRPL};
  padding-top: ${landscapeRatio};
  position: relative;
  overflow: hidden;
`;

const VideoPlayer = ({ imageUrl, episodeIsAvailable, mediaId, type, skin }) => {
  const { translations, service } = useContext(ServiceContext);
  const { isAmp, platform } = useContext(RequestContext);
  const location = useLocation();
  const isValidPlatform = ['amp', 'canonical'].includes(platform);
  const mediaInfo = {
    title: 'On-demand TV',
    type,
  };
  const noJsMessage = pathOr(
    `This ${mediaInfo.type} cannot play in your browser. Please enable JavaScript or try a different browser.`,
    ['media', 'noJs'],
    translations,
  );

  if (!episodeIsAvailable) {
    const expiredContentMessage = pathOr(
      'This content is no longer available',
      ['media', 'contentExpired'],
      translations,
    );

    return (
      <StyledMessageContainer>
        <MediaMessage service={service} message={expiredContentMessage} />
      </StyledMessageContainer>
    );
  }
  const placeholderSrc = getPlaceholderImageUrl(imageUrl);

  if (!isValidPlatform || !mediaId) return null;

  const embedUrl = getEmbedUrl({
    mediaId,
    type,
    isAmp,
    queryString: location.search,
  });

  const iframeTitle = pathOr(
    'Video player',
    ['mediaAssetPage', 'videoPlayer'],
    translations,
  );

  return (
    <StyledWrapper>
      {isAmp ? (
        <AmpMediaPlayer
          placeholderSrc={placeholderSrc}
          src={embedUrl}
          title={iframeTitle}
          skin={skin}
          noJsMessage={noJsMessage}
          service={service}
        />
      ) : (
        <CanonicalMediaPlayer
          showPlaceholder={false}
          src={embedUrl}
          title={iframeTitle}
          service={service}
          skin={skin}
          mediaInfo={mediaInfo}
          noJsMessage={noJsMessage}
          noJsClassName="no-js"
        />
      )}
    </StyledWrapper>
  );
};

VideoPlayer.propTypes = {
  imageUrl: string,
  episodeIsAvailable: bool,
  mediaId: string,
  type: string,
  skin: string,
};

VideoPlayer.defaultProps = {
  imageUrl: '',
  episodeIsAvailable: true,
  mediaId: '',
  type: '',
  skin: 'video',
};

export default VideoPlayer;
