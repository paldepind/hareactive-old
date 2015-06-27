var hare = require('./hareactive.js');
var B = hare.Behavior;

B.map = function(fn, b) {
  return b.map(fn);
};

B.push = function(b, v) {
  b.push(v);
};

module.exports = B;
