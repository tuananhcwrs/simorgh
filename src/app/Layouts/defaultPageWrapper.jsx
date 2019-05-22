import React, { Fragment } from 'react';
import { node, string, bool } from 'prop-types';
import Helmet from 'react-helmet';
import HeaderContainer from '../containers/Header';
import FooterContainer from '../containers/Footer';
import { ServiceContextProvider } from '../contexts/ServiceContext';
import { RequestContextProvider } from '../contexts/RequestContext';
import GlobalStyle from '../lib/globalStyles';
import ConsentBanner from '../containers/ConsentBanner';
import getStatsDestination from '../contexts/RequestContext/getStatsDestination';
import getStatsPageIdentifier from '../contexts/RequestContext/getStatsPageIdentifier';
import getOrigin from '../contexts/RequestContext/getOrigin';
import getEnv from '../contexts/RequestContext/getEnv';

const PageWrapper = ({ bbcOrigin, children, id, service, isAmp }) => {
  const origin = getOrigin(bbcOrigin);
  const isUK = !origin.includes('.com');
  const env = getEnv(origin);

  return (
    <Fragment>
      <GlobalStyle />
      <ServiceContextProvider service={service}>
        <RequestContextProvider
          env={env}
          id={id}
          isUK={isUK}
          origin={origin}
          platform={isAmp ? 'amp' : 'canonical'}
          statsDestination={getStatsDestination({
            isUK,
            env,
            service,
          })}
          statsPageIdentifier={getStatsPageIdentifier({
            pageType: 'article',
            service,
            id,
          })}
        >
          <Helmet>
            <link rel="manifest" href={`/${service}/articles/manifest.json`} />
          </Helmet>
          <ConsentBanner />
          <HeaderContainer />
          {children}
          <FooterContainer />
        </RequestContextProvider>
      </ServiceContextProvider>
    </Fragment>
  );
};

PageWrapper.propTypes = {
  bbcOrigin: string,
  children: node.isRequired,
  id: string.isRequired,
  isAmp: bool.isRequired,
  service: string.isRequired,
};

PageWrapper.defaultProps = {
  bbcOrigin: null,
};

PageWrapper.defaultProps = {};

export default PageWrapper;
