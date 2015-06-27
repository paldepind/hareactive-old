var hare = require('./hareactive.js');
var E = hare.Event;
var Event = E.Event;

// Filter

function FilterBody(pred, ev) {
  this.pred = pred;
  this.ev = ev;
}

FilterBody.prototype.run = function(v) {
  if (this.pred(v) === true) {
    this.ev.push(v);
  }
};

E.filter = function(pred, srcEv) {
  var filterEv = new Event();
  filterEv.body = new FilterBody(pred, filterEv);
  srcEv.eventListeners.push(filterEv);
  return filterEv;
};

// Scan

function ScanBody(fn, acc, ev) {
  this.fn = fn;
  this.acc = acc;
  this.ev = ev;
}

ScanBody.prototype.run = function(v) {
  this.acc = this.fn(this.acc, v);
  this.ev.push(this.acc);
};

E.scan = function(fn, acc, srcEv) {
  var scanEv = new Event();
  scanEv.body = new ScanBody(fn, acc, scanEv);
  srcEv.eventListeners.push(scanEv);
  return scanEv;
};

E.map = function(fn, srcEv) {
  return srcEv.map(fn);
};

E.ap = function(fnE, valE) {
  return fnE.ap(valE);
};

module.exports = E;
