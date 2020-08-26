import React, { useEffect, useState, useRef, memo } from 'react';
import equals from 'ramda/src/equals';
import { renderRoutes } from 'react-router-config';
import { withRouter } from 'react-router';
import path from 'ramda/src/path';
import getRouteProps from '#app/routes/utils/fetchPageData/utils/getRouteProps';
import usePrevious from '#lib/utilities/usePrevious';
import getToggles from '#app/lib/utilities/getToggles';

export const App = ({ routes, location, initialData, bbcOrigin }) => {
  const {
    service,
    isAmp,
    variant,
    id,
    assetUri,
    errorCode,
    route: { pageType },
  } = getRouteProps(routes, location.pathname);

  const {
    pageData,
    toggles,
    status,
    error,
    timeOnServer,
    showAdsBasedOnLocation,
  } = initialData;

  const [state, setState] = useState({
    pageData,
    toggles,
    status,
    service,
    variant,
    id,
    assetUri,
    isAmp,
    pageType,
    error,
    loading: false,
    errorCode: errorCode || initialData.errorCode,
    timeOnServer,
  });

  const isInitialMount = useRef(true);
  const shouldSetFocus = useRef(false);

  useEffect(() => {
    if (shouldSetFocus.current) {
      const contentEl = document.querySelector('h1#content');
      if (contentEl) {
        contentEl.focus();
      }
      shouldSetFocus.current = false;
    }
  }, [state.loading, state.pageData]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      // Only update on subsequent page renders
      const {
        service: nextService,
        variant: nextVariant,
        id: nextId,
        assetUri: nextAssetUri,
        isAmp: nextIsAmp,
        route: { getInitialData, pageType: nextPageType },
      } = getRouteProps(routes, location.pathname);

      let loaderTimeout;
      const loaderPromise = new Promise(resolve => {
        loaderTimeout = setTimeout(resolve, 500);
      });

      loaderPromise.then(() => {
        setState({
          pageData: null,
          toggles,
          status: null,
          service: nextService,
          variant: nextVariant,
          id: nextId,
          assetUri: nextAssetUri,
          isAmp: nextIsAmp,
          pageType: nextPageType,
          loading: true,
          error: null,
          errorCode: null,
          timeOnServer: null,
        });
      });

      const updateAppState = async () => {
        const nextToggles = await getToggles(nextService);
        const data = await getInitialData({
          path: location.pathname,
          service: nextService,
          variant: nextVariant,
          pageType: nextPageType,
          toggles: nextToggles,
        });

        clearTimeout(loaderTimeout);
        shouldSetFocus.current = true;
        setState({
          service: nextService,
          variant: nextVariant,
          id: nextId,
          assetUri: nextAssetUri,
          isAmp: nextIsAmp,
          pageType: nextPageType,
          loading: false,
          pageData: path(['pageData'], data),
          toggles: nextToggles,
          status: path(['status'], data),
          error: path(['error'], data),
          errorCode: null,
          timeOnServer: path(['timeOnServer'], data),
        });
      };

      updateAppState();
    }
  }, [routes, location.pathname, toggles]);

  const previousLocationPath = usePrevious(location.pathname);

  // clear the previous path on back clicks
  const previousPath = previousLocationPath;

  const props = {
    ...state,
    bbcOrigin,
    showAdsBasedOnLocation,
    pathname: location.pathname,
    previousPath,
    routes,
  };

  return <MemoApp {...props} />;
};

const NewApp = props => renderRoutes(props.routes, props);
const isPageDataTheSame = (prevProps, nextProps) => {
  const isSame = equals(prevProps.pageData, nextProps.pageData);
  console.log('isSame', isSame);
  return isSame;
};

const MemoApp = memo(NewApp, isPageDataTheSame);

export default withRouter(App);
