import React from 'react';
import Draggable from '../src/index';

import './demo.less';

React.render(
  <div className="ctn">
    <Draggable>
      <div className="square"></div>
    </Draggable>
  </div>,
  document.getElementById('normal')
);

React.render(
  <div className="ctn">
    <Draggable start={{x: 100,y: 100}}>
      <div className="square"></div>
    </Draggable>
  </div>,
  document.getElementById('startPoint')
);

React.render(
  <div className="ctn">
    <Draggable axis="x">
      <div className="square"></div>
    </Draggable>
  </div>,
  document.getElementById('axisX')
);

React.render(
  <div className="ctn">
    <Draggable axis="y">
      <div className="square"></div>
    </Draggable>
  </div>,
  document.getElementById('axisY')
);

React.render(
  <div className="ctn">
    <Draggable grid={{
        x: 100,
        y: 100
      }}>
      <div className="square"></div>
    </Draggable>
  </div>,
  document.getElementById('grid')
);

React.render(
  <div className="ctn">
    <Draggable limit="parent">
      <div className="square"></div>
    </Draggable>
  </div>,
  document.getElementById('limit-parent')
);

React.render(
  <div className="ctn">
    <Draggable start={{x: 100, y: 0}} limit={{
      x: [100, 'parent'],
      y: 'parent'
    }}>
      <div className="square"></div>
    </Draggable>
  </div>,
  document.getElementById('limit-area')
);

React.render(
  <div className="ctn">
    <Draggable shadow={false}>
      <div className="square"></div>
    </Draggable>
  </div>,
  document.getElementById('no-shadow')
);

React.render(
  <div className="ctn">
    <Draggable dragger=".dragger">
      <div className="square">
        <div className="dragger"></div>
      </div>
    </Draggable>
  </div>,
  document.getElementById('dragger')
);
