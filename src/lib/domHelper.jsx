function getInnerSize(el) {
  return {
    width: el.clientWidth,
    height: el.clientHeight
  };
}

function getOuterSize(el) {
  let computedStyle = window.getComputedStyle(el);
  return {
    width: el.clientWidth + parseFloat(computedStyle.borderLeftWidth) + parseFloat(computedStyle.borderLeftWidth),
    height: el.clientHeight + parseFloat(computedStyle.borderTopWidth) + parseFloat(computedStyle.borderBottomWidth)
  };
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

const userSelectNone = {
  WebkitUserSelect: 'none',
  MozUserSelect: 'none',
  msUserSelect: 'none',
  OUserSelect: 'none',
  userSelect: 'none'
}

export default {
  getInnerSize,
  getOuterSize,
  matchSelector,
  userSelectNone
};
