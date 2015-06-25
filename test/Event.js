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
  describe('concat', function() {
    it('calls listeners with events from both', function() {
      var result = [];
      var ev1 = Event.Event();
      var ev2 = Event.Event();
      var both = ev1.concat(ev2);
      both.listen(function(v) { result.push(v); });
      ev1.push(1);
      ev2.push(2);
      ev1.push(3);
      assert.deepEqual(result, [1, 2, 3]);
    });
    it('is associative', function() {
      var result1 = [];
      var result2 = [];
      var ev1 = Event.Event();
      var ev2 = Event.Event();
      var first = ev1.concat(ev2);
      var second = ev2.concat(ev1);
      first.listen(function(v) { result1.push(v); });
      second.listen(function(v) { result2.push(v); });
      ev1.push(1);
      ev2.push(2);
      ev1.push(3);
      ev2.push(4);
      assert.deepEqual(result1, [1, 2, 3, 4]);
      assert.deepEqual(result1, result2);
    });
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
