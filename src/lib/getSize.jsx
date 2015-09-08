function getInnerSize(el) {
  let computedStyle = window.getComputedStyle(el);
  return {
    width: el.clientWidth - parseFloat(computedStyle.paddingLeft) - parseFloat(computedStyle.paddingRight),
    height: el.clientHeight - parseFloat(computedStyle.paddingTop) - parseFloat(computedStyle.paddingBottom)
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
