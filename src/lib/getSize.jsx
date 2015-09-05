function getInnerSize(el) {
  let computedStyle = window.getComputedStyle(el);
  return {
    width: el.clientHeight - parseFloat(computedStyle.paddingLeft) - parseFloat(computedStyle.paddingRight),
    height: el.clientWidth - parseFloat(computedStyle.paddingTop) - parseFloat(computedStyle.paddingBottom)
  };
}

function getOuterSize(el) {
  let computedStyle = window.getComputedStyle(el);
  return {
    width: el.clientHeight + parseFloat(computedStyle.borderLeftWidth) + parseFloat(computedStyle.borderLeftWidth),
    height: el.clientWidth + parseFloat(computedStyle.borderTopWidth) + parseFloat(computedStyle.borderBottomWidth)
  };
}

export default {
  getInnerSize,
  getOuterSize
};
