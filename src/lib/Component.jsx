import React from 'react';

import {
  getInnerSize, getOuterSize
} from './getSize';

function range(val, min, max) {
  val = val > max ? max : val;
  val = val < min ? min : val;
  return val;
}

export default class Draggable extends React.Component {
  static displayName = 'Draggable'
  static propTypes = {
    axis: React.PropTypes.oneOf([
      'both', 'x', 'y'
    ]),
    children: React.PropTypes.node,
    dragger: React.PropTypes.string,
    grid: React.PropTypes.shape({
      x: React.PropTypes.number,
      y: React.PropTypes.number
    }),
    limit: React.PropTypes.oneOfType([
      React.PropTypes.shape({
        x: React.PropTypes.arrayOf(React.PropTypes.number),
        y: React.PropTypes.arrayOf(React.PropTypes.number)
      }),
      React.PropTypes.oneOf(['parent', null])
    ]),
    shadow: React.PropTypes.bool,
    start: React.PropTypes.shape({
      x: React.PropTypes.number,
      y: React.PropTypes.number
    })
  }
  static defaultProps = {
    start: {
      x: 0,
      y: 0
    },
    grid: {
      x: 1,
      y: 1
    },
    dragger: null,
    axis: 'both',
    limit: null,
    shadow: true
  }
  constructor(props) {
    super();
    this.state = this._initState(props);
    this._handleMouseDown = this._handleMouseDown.bind(this);
    this._handleMouseMove = this._handleMouseMove.bind(this);
    this._handleMouseUp = this._handleMouseUp.bind(this);
  }
  componentWillReceiveProps(props) {
    if (props.start)
      this.setState(this._initState(props));
  }
  _initState(props) {
    return {
      dragging: false,
      offsetX: 0,
      offsetY: 0,
      x: props.start.x,
      y: props.start.y
    };
  }
  _matchSelector(el, selector) {
    return ['matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector'].reduce((rst, method) => rst || (typeof el[method] === 'function' && el[method].call(el, selector)), false);
  }
  _handleMouseDown(e) {
    if(this.props.dragger && !this._matchSelector(e.target, this.props.dragger))
      return;
    var state = {
      dragging: true,
      dragStartX: e.pageX,
      dragStartY: e.pageY,
      offsetX: 0,
      offsetY: 0
    };
    var elSize = getOuterSize(React.findDOMNode(this).querySelector('.react-as-dnd-content'));
    var limit = this.props.limit;
    if (!limit)
      this._limitOffset = {
        x: [ -Infinity, Infinity ],
        y: [ -Infinity, Infinity ]
      };
    else if (limit === 'parent') {
      let parentSize = getInnerSize(React.findDOMNode(this).offsetParent);
      this._limitOffset = {
        x: [ -this.state.x, parentSize.width - this.state.x - elSize.width ],
        y: [ -this.state.y, parentSize.height - this.state.y - elSize.height ]
      };
    } else
      this._limitOffset = {
        x: [ limit.x[0] - this.state.x, limit.x[1] - this.state.x ],
        y: [ limit.y[0] - this.state.y, limit.y[1] - this.state.y ]
      };
    document.addEventListener('mousemove', this._handleMouseMove, false);
    document.addEventListener('mouseup', this._handleMouseUp, false);
    this.setState(state);
  }
  _handleMouseMove(e) {
    var {
      axis, grid
    } = this.props;
    var axisX = axis === 'both' || axis === 'x' || false;
    var axisY = axis === 'both' || axis === 'y' || false;
    var limit = this._limitOffset;
    this.setState({
      offsetX: axisX ? range((Math.floor((e.pageX - this.state.dragStartX) / grid.x) * grid.x), limit.x[0], limit.x[1]) : 0,
      offsetY: axisY ? range((Math.floor((e.pageY - this.state.dragStartY) / grid.y) * grid.y), limit.y[0], limit.y[1]) : 0
    });
  }
  _handleMouseUp() {
    document.removeEventListener('mousemove', this._handleMouseMove);
    document.removeEventListener('mouseup', this._handleMouseUp);
    this.setState({
      dragging: false,
      offsetX: 0,
      offsetY: 0,
      x: this.state.offsetX + this.state.x,
      y: this.state.offsetY + this.state.y
    });
    delete this._limitOffset;
  }
  render() {
    return (
      <div className="react-as-dnd">
        <div className="react-as-dnd-content" onMouseDown={!this.state.dragging && this._handleMouseDown} style={{
          position: 'absolute',
          left: this.props.shadow ? this.state.x : (this.state.x + this.state.offsetX),
          top: this.props.shadow ? this.state.y : (this.state.y + this.state.offsetY)
        }}>
          {this.props.children}
        </div>
        {this.props.shadow && this.state.dragging && <div className="react-as-dnd-shadow" style={{
            position: 'absolute',
            opacity: 0.5,
            left: this.state.x + this.state.offsetX,
            top: this.state.y + this.state.offsetY
          }}>
            {React.cloneElement(React.Children.only(this.props.children))}
          </div>}
      </div>
    );
  }
}
