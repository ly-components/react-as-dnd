
const noop = () => {};

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

export default {
  noop,
  range,
  merge
};
