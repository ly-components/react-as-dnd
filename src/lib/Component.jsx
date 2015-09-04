import React from 'react';

export default class Draggable extends React.Component {
	static displayName = 'Draggable'
	static propTypes = {
		children: React.PropTypes.node,
		start: React.PropTypes.shape({
			x: React.PropTypes.number,
			y: React.PropTypes.number
		})
	}
	static defaultProps = {
		start: {
			x: 0,
			y: 0
		}
	}
	constructor(props) {
		super();
		this.state = this._initState(props);
		this._handleMouseDown = this._handleMouseDown.bind(this);
		this._handleMouseMove = this._handleMouseMove.bind(this);
		this._handleMouseUp = this._handleMouseUp.bind(this);
	}
	componentWillReceiveProps(props) {
		if(props.start)
			this.setState(this._initState(props));
	}
	_initState(props) {
		return {
			dragging: false,
			offsetX: 0,
			offsetY: 0,
			clientX: props.start.x,
			clientY: props.start.y
		};
	}
	_handleMouseDown(e) {
		var state = {
			dragging: true,
			dragStartX: e.pageX,
			dragStartY: e.pageY,
			offsetX: 0,
			offsetY: 0,
			clientX: this.state.clientX,
			clientY: this.state.clientY
		};
		document.addEventListener('mousemove', this._handleMouseMove, false);
		document.addEventListener('mouseup', this._handleMouseUp, false);
		this.setState(state);
	}
	_handleMouseMove(e) {
		this.setState({
			offsetX: e.pageX - this.state.dragStartX,
			offsetY: e.pageY - this.state.dragStartY
		});
	}
	_handleMouseUp() {
		document.removeEventListener('mousemove', this._handleMouseMove);
		document.removeEventListener('mouseup', this._handleMouseUp);
		this.setState({
			dragging: false,
			offsetX: 0,
			offsetY: 0,
			clientX: this.state.offsetX + this.state.clientX,
			clientY: this.state.offsetY + this.state.clientY
		});
	}
	render() {
		var style = {
			position: 'absolute',
			left: this.state.clientX + this.state.offsetX,
			top: this.state.clientY + this.state.offsetY
		};
		return (
			<div className="react-as-dnd" onMouseDown={!this.state.dragging && this._handleMouseDown} style={style}>
				{this.props.children}
			</div>
		);
	}
}
