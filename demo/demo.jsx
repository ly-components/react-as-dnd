import React from 'react';
import Draggable from '../src/index';

import './demo.less';

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

// React.render(
//   <div className="container">
//     <Draggable {...config}>
//       <div className="header"></div>
//       <div className="content">
//         asdlfjaskldjfklajsdl
//       </div>
//     </Draggable>
//   </div>,
//   document.getElementById('demo')
// );


class NumberInput extends React.Component {
  static displayName = 'NumberInput'
  static propTypes = {
    max: React.PropTypes.number,
    min: React.PropTypes.number,
    onChange: React.PropTypes.func,
    step: React.PropTypes.number,
    value: React.PropTypes.number,
    width: React.PropTypes.number
  }
  static defaultProps = {
    min: 0,
    max: 100,
    value: 0,
    step: 1,
    width: 300,
    onChange: () => {}
  }
  constructor(props) {
    super();
    this.state = {
      value: props.value,
      dragging: false
    };
    this._getPixPerStep = this._getPixPerStep.bind(this);
    this._value2offset = this._value2offset.bind(this);
    this._offset2value = this._offset2value.bind(this);
    this._handleDragMove = this._handleDragMove.bind(this);
    this._handleDragStart = this._handleDragStart.bind(this);
    this._handleDragEnd = this._handleDragEnd.bind(this);
  }
  componentWillReceiveProps(props) {
    ('value' in props) && (this.state.value = props.value);
  }
  _getPixPerStep() {
    let props = this.props;
    let totalSteps = (props.max - props.min) / props.step;
    let pixPerStep = props.width / totalSteps;
    return pixPerStep;
  }
  _value2offset(value) {
    let props = this.props;
    let totalSteps = (props.max - props.min) / props.step;
    let curStep = Math.round((value - props.min) / (props.max - props.min) * totalSteps);
    let pixPerStep = this._getPixPerStep();
    return curStep * pixPerStep;
  }
  _offset2value(len) {
    let pixPerStep = this._getPixPerStep();
    let steps = Math.round(len / pixPerStep);
    return steps * this.props.step;
  }
  _handleDragMove(e) {
    let value = this._offset2value(e.dragShowX);
    this.setState({
      value
    });
    this.props.onChange(value);
  }
  _handleDragStart() {
    this.setState({
      dragging: true
    });
  }
  _handleDragEnd() {
    this.setState({
      dragging: false
    });
  }
  render() {
    let config = {
      start: {
        x: this._value2offset(this.state.value),
        y: 5
      },
      grid: {
        x: this._getPixPerStep(),
        y: 0
      },
      limit: 'parent',
      axis: 'x',
      shadow: false,
      onDragMove: this._handleDragMove,
      onDragStart: this._handleDragStart,
      onDragEnd: this._handleDragEnd
    };
    return (
      <div className="react-as-number-input" style={{width: this.props.width}}>
        <div className="react-as-number-input-line"></div>
        <Draggable {...config}>
          <span className="react-as-number-input-btn"></span>
        </Draggable>
      </div>
    );
  }
}


React.render(
  <div>
    <NumberInput width={300} min={0} max={100} step={1} onChange={(v) => console.log(v)}></NumberInput>
  </div>,
  document.getElementById('number')
);
