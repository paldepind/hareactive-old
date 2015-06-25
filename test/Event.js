var assert = require('assert');

var Event = require('../Event.js');

function isEven(n) {
  return n % 2 === 0;
}

function double(n) {
  return n * 2;
}

function add(x, y) {
  return x + y;
}

describe('Event', function() {
  it('calls listeners', function() {
    var result = [];
    var ev = Event.Event();
    ev.listen(function(v) { result.push(v); });
    ev.push(1);
    ev.push(2);
    ev.push(3);
    assert.deepEqual(result, [1, 2, 3]);
  });
  it('maps values', function() {
    var result = [];
    var ev = Event.Event();
    var mapped = Event.map(double, ev);
    mapped.listen(function(v) { result.push(v); });
    ev.push(1);
    ev.push(2);
    ev.push(3);
    assert.deepEqual(result, [2, 4, 6]);
  });
  it('filters values', function() {
    var result = [];
    var ev = Event.Event();
    var filtered = Event.filter(isEven, ev);
    filtered.listen(function(v) { result.push(v); });
    ev.push(1);
    ev.push(2);
    ev.push(3);
    assert.deepEqual(result, [2]);
  });
  it('scans values', function() {
    var result = [];
    var ev = Event.Event();
    var scanned = Event.scan(add, 0, ev);
    scanned.listen(function(v) { result.push(v); });
    ev.push(1);
    ev.push(2);
    ev.push(3);
    assert.deepEqual(result, [1, 3, 6]);
  });
});
