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

export default {
  getInnerSize,
  getOuterSize
};
