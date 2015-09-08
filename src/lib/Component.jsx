import React from 'react';
import ReactMixin from 'react-mixin';
import EventMixin from 'react-as-event-mixin';

import {
  getInnerSize,
  getOuterSize
} from './getSize';

let noop = () => {};
let userSelectNone = {
  WebkitUserSelect: 'none',
  mozUserSelect: 'none',
  msUserSelect: 'none',
  oUserSelect: 'none',
  userSelect: 'none'
};

function range(val, min, max) {
  val = val > max ? max : val;
  val = val < min ? min : val;
  return val;
}

function merge(dist, ...src) {
  src.forEach(s => {
    for(let key in s)
      dist[key] = s[key];
  });
  return dist;
}

function matchSelector(el, selector) {
  return [
    'matches',
    'webkitMatchesSelector',
    'mozMatchesSelector',
    'msMatchesSelector',
    'oMatchesSelector'
  ].reduce((rst, method) => rst || (typeof el[method] === 'function' && el[method].call(el, selector)), false);
}

class Draggable extends React.Component {
  static displayName = 'Draggable'
  static propTypes = {
    axis: React.PropTypes.oneOf([
      'both', 'x', 'y'
    ]),
    children: React.PropTypes.node,
    closeSelectOnDrag: React.PropTypes.bool,
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
    onDragEnd: React.PropTypes.func,
    onDragMove: React.PropTypes.func,
    onDragStart: React.PropTypes.func,
    opacity: React.PropTypes.number,
    shadow: React.PropTypes.bool,
    start: React.PropTypes.shape({
      x: React.PropTypes.number,
      y: React.PropTypes.number
    }),
    zIndex: React.PropTypes.number
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
    shadow: true,
    zIndex: 9999,
    onDragStart: noop,
    onDragEnd: noop,
    onDragMove: noop,
    opacity: 0.5,
    closeSelectOnDrag: true
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
  componentWillUnmount() {
    document.removeEventListener('mousemove', this._handleMouseMove);
    document.removeEventListener('mouseup', this._handleMouseUp);
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
  _handleMouseDown(e) {
    if(this.props.dragger && !matchSelector(e.target, this.props.dragger))
      return;
    let oldState = this.state;
    let state = {
      dragging: true,
      dragStartX: e.pageX,
      dragStartY: e.pageY,
      offsetX: 0,
      offsetY: 0
    };
    let elSize = getOuterSize(React.findDOMNode(this).querySelector('.react-as-dnd-content'));
    let limit = this.props.limit;
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
    this.fireAll('dragStart', this._createEventObj(e, merge({}, oldState, state)));
  }
  _createEventObj(e, state) {
    return merge(e, {
      dragging: state.dragging,
      dragStartX: state.dragStartX,
      dragStartY: state.dragStartY,
      dragOffsetX: state.offsetX,
      dragOffsetY: state.offsetY,
      dragShowX: state.x + state.offsetX,
      dragShowY: state.y + state.offsetY
    });
  }
  _handleMouseMove(e) {
    let {
      axis, grid
    } = this.props;
    let axisX = axis === 'both' || axis === 'x' || false;
    let axisY = axis === 'both' || axis === 'y' || false;
    let limit = this._limitOffset;
    let oldState = this.state;
    let state = {
      offsetX: axisX ? range((Math.floor((e.pageX - this.state.dragStartX) / grid.x) * grid.x), limit.x[0], limit.x[1]) : 0,
      offsetY: axisY ? range((Math.floor((e.pageY - this.state.dragStartY) / grid.y) * grid.y), limit.y[0], limit.y[1]) : 0
    };
    if(state.offsetX === oldState.offsetX && state.offsetY === oldState.offsetY) return;
    this.setState(state);
    this.fireAll('dragMove', this._createEventObj(e, merge({}, oldState, state)));
  }
  _handleMouseUp(e) {
    document.removeEventListener('mousemove', this._handleMouseMove);
    document.removeEventListener('mouseup', this._handleMouseUp);
    let state = this.state;
    this.setState({
      dragging: false,
      offsetX: 0,
      offsetY: 0,
      x: state.offsetX + state.x,
      y: state.offsetY + state.y
    });
    delete this._limitOffset;
    this.fireAll('dragEnd', this._createEventObj(e, merge({}, state, {
      dragging: false
    })));
  }
  render() {
    let contentStyle = merge({
      position: 'absolute',
      zIndex: this.props.zIndex,
      left: this.props.shadow ? this.state.x : (this.state.x + this.state.offsetX),
      top: this.props.shadow ? this.state.y : (this.state.y + this.state.offsetY)
    }, this.props.closeSelectOnDrag && this.state.dragging ? userSelectNone : {});
    let shadowStyle = this.props.shadow && this.state.dragging && merge({
      position: 'absolute',
      zIndex: this.props.zIndex,
      opacity: 0.5,
      left: this.state.x + this.state.offsetX,
      top: this.state.y + this.state.offsetY
    }, this.props.closeSelectOnDrag ? userSelectNone : {});
    return (
      <div className="react-as-dnd">
        <div className="react-as-dnd-content" onMouseDown={!this.state.dragging && this._handleMouseDown} style={contentStyle}>
          {this.props.children}
        </div>
        {
          this.props.shadow && this.state.dragging && <div className="react-as-dnd-shadow" style={shadowStyle}>
            {
              React.Children.map(this.props.children, child => React.cloneElement(React.Children.only(child)))
            }
          </div>
        }
      </div>
    );
  }
}

ReactMixin(Draggable.prototype, EventMixin);

export default Draggable;
