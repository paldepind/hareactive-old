var assert = require('assert');

var E = require('../Event.js');
var B = require('../Behavior.js');

function id(v) {
  return v;
}

function isEven(n) {
  return n % 2 === 0;
}

function double(n) {
  return n * 2;
}

function add(x, y) {
  if (arguments.length === 1) {
    return function(y) { return x + y; };
  }
  return x + y;
}

describe('Behavior', function() {
  it('pulls constant function', function() {
    var b = B.Behavior(0);
    assert.equal(B.at(b), 0);
    b.push(1);
    assert.equal(B.at(b), 1);
    b.push(2);
    assert.equal(B.at(b), 2);
    b.push(3);
    assert.equal(B.at(b), 3);
  });
  it('pushes from time varying functions', function() {
    var time = 0;
    var b = B.Behavior(B.Fun(function() {
      return time;
    }));
    assert.equal(B.at(b), 0);
    time = 1;
    assert.equal(B.at(b), 1);
    time = 2;
    assert.equal(B.at(b), 2);
    time = 3;
    assert.equal(B.at(b), 3);
  });
  describe('concat', function() {
    it('calls listeners with events from both', function() {
      var result = [];
      var ev1 = B.Behavior();
      var ev2 = B.Behavior();
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
      var ev1 = B.Behavior();
      var ev2 = B.Behavior();
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
  describe('map', function() {
    it('maps constant function', function() {
      var b = B.Behavior(0);
      var mapped = B.map(double, b);
      assert.equal(B.at(b), 0);
      B.push(b, 1);
      assert.equal(B.at(mapped), 2);
      B.push(b, 2);
      assert.equal(B.at(mapped), 4);
      B.push(b, 3);
      assert.equal(B.at(mapped), 6);
    });
    it('maps values method', function() {
      var b = B.Behavior();
      var mapped = b.map(double);
      b.push(1);
      assert.equal(B.at(mapped), 2);
      b.push(2);
      assert.equal(B.at(mapped), 4);
      b.push(3);
      assert.equal(B.at(mapped), 6);
    });
    it('maps time function', function() {
      var time = 0;
      var b = B.Behavior(B.Fun(function() {
        return time;
      }));
      var mapped = B.map(double, b);
      assert.equal(B.at(mapped), 0);
      time = 1;
      assert.equal(B.at(mapped), 2);
      time = 2;
      assert.equal(B.at(mapped), 4);
      time = 3;
      assert.equal(B.at(mapped), 6);
    });
  });
  describe('ap', function() {
    it('applies event of functions to event of numbers', function() {
      var result = [];
      var fnE = B.Behavior();
      var numE = B.Behavior();
      var applied = E.ap(fnE, numE);
      applied.listen(function(v) { result.push(v); });
      fnE.push(add(1));
      numE.push(2);
      fnE.push(double);
      fnE.push(isEven);
      numE.push(7);
      fnE.push(double);
      assert.deepEqual(result, [3, 4, true, false, 14]);
    });
  });
  describe('of', function() {
    it('identity', function() {
      var result1 = [];
      var result2 = [];
      var numB = B.Behavior(0);
      var num2B = B.of(id).ap(numB);
      numB.push(1);
      assert.equal(B.at(numB), 1);
      assert.equal(B.at(num2B), 1);
      numB.push(2);
      assert.equal(B.at(numB), 2);
      assert.equal(B.at(num2B), 2);
      numB.push(3);
      assert.equal(B.at(numB), 3);
      assert.equal(B.at(num2B), 3);
    });
  });
  it('can switch from constant to varying and back', function() {
    var time = 0;
    var b = B.Behavior(0);
    var mapped = B.map(double, b);
    assert.equal(B.at(mapped), 0);
    B.set(b, function() {
      return time;
    });
    assert.equal(B.at(mapped), 0);
    time = 2;
    assert.equal(B.at(mapped), 4);
    B.push(b, 4);
    assert.equal(B.at(mapped), 8);
  });
});
