import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

import RootContainer from './root.js';
var rootEl = document.getElementById('root');

const RootRender = (Component) => {
  ReactDOM.render(
    <Component />,
    rootEl
  );
}

RootRender(RootContainer);

if(module.hot){
  module.hot.accept('./root.js', () => {
    const NextRootContainer = require('./root.js').default;
    RootRender(NextRootContainer);
  })
}
