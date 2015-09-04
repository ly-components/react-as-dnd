import React from 'react';
import Component from '../src/index';

var config = {
  start: {
    x: 300,
    y: 300
  }
};

React.render(
  <div className="container">
    <Component {...config}>
      <div className="content"></div>
    </Component>
  </div>,
  document.getElementById('demo')
);
