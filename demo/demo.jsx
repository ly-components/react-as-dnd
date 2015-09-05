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
    x: [0, 600],
    y: [0, 600]
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
