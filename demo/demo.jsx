import React from 'react';
import Component from '../src/index';

var config = {
  start: {
    x: 300,
    y: 300
  },
  axis: 'both',
  grid: {
    x: 50,
    y: 50
  },
  limit: {
    x: [0, 300],
    y: [0, 300]
  },
  shadow: true,
  dragger: '.header'
};

React.render(
  <div className="container">
    <Component {...config}>
      <div className="content">
        <div className="header"></div>
        <div className="content"></div>
      </div>
    </Component>
  </div>,
  document.getElementById('demo')
);
