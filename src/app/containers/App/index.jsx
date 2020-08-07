/* eslint-disable */
/*
 * © Jordan Tart https://github.com/jtart
 * https://github.com/jtart/react-universal-app
 */
import React, { useState } from 'react';
import { StaticRouter, BrowserRouter } from 'react-router-dom';
import App from './App';
import PopOutPlayer from './popoutplayer';

export const PopOutPlayerContext = React.createContext({});

export const ClientApp = (props) => {
  let [isEnabled, setIsEnabled] = useState(false);

  // window.setTimeout(() => setIsEnabled(isEnabled + 1), 1000)

  return (
    <BrowserRouter {...props}>
      <PopOutPlayerContext.Provider value={{ isEnabled, setIsEnabled }}>
        <App initialData={props.data} routes={props.routes} />
        <PopOutPlayer />
      </PopOutPlayerContext.Provider>
    </BrowserRouter>
  );
};

export const ServerApp = (props) => {
  return (
    <StaticRouter {...props}>
        <App
          initialData={props.data}
          routes={props.routes}
          bbcOrigin={props.bbcOrigin}
        />
    </StaticRouter>
  )
};
