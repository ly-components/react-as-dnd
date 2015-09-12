import React from 'react';
import ReactMixin from 'react-mixin';
import EventMixin from 'react-as-event-mixin';

import {
  getInnerSize,
  getOuterSize,
  matchSelector,
  userSelectNone
} from './domHelper';

import {
  noop,
  range,
  merge
} from './util';

const propMapping = {
  x: 'width',
  y: 'height'
};

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
    limit: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.shape({
      x: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.arrayOf(React.PropTypes.number)]),
      y: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.arrayOf(React.PropTypes.number)])
    })]),
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
    this.state = {
      dragging: false,
      offsetX: 0,
      offsetY: 0,
      x: props.start.x,
      y: props.start.y
    };
    this._handleMouseDown = this._handleMouseDown.bind(this);
    this._handleMouseMove = this._handleMouseMove.bind(this);
    this._handleMouseUp = this._handleMouseUp.bind(this);
    this._getLimit = this._getLimit.bind(this);
  }
  componentWillUnmount() {
    document.removeEventListener('mousemove', this._handleMouseMove);
    document.removeEventListener('mouseup', this._handleMouseUp);
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
    this._limitOffset = this._getLimit();
    document.addEventListener('mousemove', this._handleMouseMove, false);
    document.addEventListener('mouseup', this._handleMouseUp, false);
    this.setState(state);
    this.fireAll('dragStart', this._createEventObj(e, merge({}, oldState, state)));
  }
  _getLimit() {
    let elSize = getOuterSize(React.findDOMNode(this).querySelector('.react-as-dnd-content'));
    let parentSize = getInnerSize(React.findDOMNode(this).offsetParent);
    let limit = this.props.limit;
    !limit && (limit = {
      x: null,
      y: null
    });
    typeof limit === 'string' && (limit = {
      x: limit,
      y: limit
    });
    let rst = {};
    ['x', 'y'].forEach(axis => {
      let axisLimit = limit[axis];
      let prop = propMapping[axis];
      (!axisLimit) && (axisLimit = [null, null]);
      (axisLimit === 'parent') && (axisLimit = ['parent', 'parent']);
      rst[axis] = [];
      if(axisLimit[0] === 'parent')
        rst[axis][0] = -this.state[axis];
      else if(typeof axisLimit[0] === 'number')
        rst[axis][0] = axisLimit[0] - this.state[axis];
      else
        rst[axis][0] = -Infinity;

      if(axisLimit[1] === 'parent')
        rst[axis][1] = parentSize[prop] - this.state[axis] - elSize[prop];
      else if(typeof axisLimit[1] === 'number')
        rst[axis][1] = axisLimit[1] - this.state[axis];
      else
        rst[axis][1] = Infinity;
    });
    return rst;
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
