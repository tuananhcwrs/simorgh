import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { PopOutPlayerContext } from '#containers/App';

import AVPlayer from '#containers/AVPlayer';

const StyledWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  margin: 20px;
  width: 400px;
  z-index: 5;
  text-align: right;
`;

export default () => {
  const { isEnabled, setIsEnabled } = useContext(PopOutPlayerContext);
  if (!isEnabled) return null;
  return (
    <StyledWrapper>
      <button onClick={() => setIsEnabled(false)} type="button">
        x
      </button>
      <AVPlayer
        assetId="123"
        placeholderSrc="123"
        title="123"
        embedUrl="https://polling.test.bbc.co.uk/ws/av-embeds/cps/pidgin/23248703/p01kx42v/pcm"
        iframeTitle="123"
        type="video"
        skin="classic"
        className="123"
        translations="123"
        service="123"
        platform="canonical"
      />
    </StyledWrapper>
  );
};
