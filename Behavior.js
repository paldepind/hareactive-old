var hare = require('./hareactive.js');
var B = hare.Behavior;

B.map = function(fn, b) {
  return b.map(fn);
};

B.push = function(b, v) {
  b.push(v);
};

B.ap = function(fnB, valB) {
  return fnB.ap(valB);
};

module.exports = B;
