import React from 'react';
import Draggable from '../src/index';

var config = {
  start: {
    x: 300,
    y: 300
  },
  axis: 'both',
  // grid: {
  //   x: 50,
  //   y: 50
  // },
  // limit: {
  //   x: [0, 300],
  //   y: [0, 300]
  // },
  limit: 'parent',
  shadow: true,
  dragger: '.header',
  onDragStart: function(e) {
    console.log('dragStart---', e.dragging, e.dragStartX, e.dragStartY, e.dragOffsetX, e.dragOffsetY, e.dragShowX, e.dragShowY);
  },
  onDragMove: function(e) {
    console.log('dragMove---', e.dragging, e.dragStartX, e.dragStartY, e.dragOffsetX, e.dragOffsetY, e.dragShowX, e.dragShowY);
  },
  onDragEnd: function(e) {
    console.log('dragEnd---', e.dragging, e.dragStartX, e.dragStartY, e.dragOffsetX, e.dragOffsetY, e.dragShowX, e.dragShowY);
  }
};

React.render(
  <div className="container">
    <Draggable {...config}>
      <div className="header"></div>
      <div className="content">
        asdlfjaskldjfklajsdl
      </div>
    </Draggable>
  </div>,
  document.getElementById('demo')
);
