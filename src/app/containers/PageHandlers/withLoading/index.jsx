/* eslint-disable react/prop-types */
import React from 'react';
import { bool, element } from 'prop-types';
import { GridWrapper, GridItemConstrainedMedium } from '#lib/styledGrid';
import getRouteProps from '#app/routes/utils/fetchPageData/utils/getRouteProps';
import routes from '#app/routes';

console.error = () => {};

const WithLoading = Component => {
  const LoadingContainer = ({
    loading,
    previousPath,
    isStaleData,
    ...props
  }) => {
    const ComponentToRender = isStaleData
      ? getRouteProps(routes, previousPath).route.component
      : Component;

    if (!loading) return <Component {...props} />;
    return (
      <main role="main">
        <GridWrapper>
          <GridItemConstrainedMedium />
        </GridWrapper>
      </main>
    );
  };

  LoadingContainer.propTypes = {
    loading: bool,
  };

  LoadingContainer.defaultProps = {
    loading: false,
  };

  return LoadingContainer;
};

WithLoading.propTypes = {
  Component: element,
};

export default WithLoading;
