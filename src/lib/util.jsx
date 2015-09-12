
const noop = () => {};

function range(val, min, max, grid) {
  while(val > max)
    val -= grid;
  while(val < min)
    val += grid;
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
