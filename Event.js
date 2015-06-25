function Event() {
  this.cbListeners = [];
  this.eventListeners = [];
  this.body = undefined;
  this.last = undefined;
}

Event.prototype.push = function(val) {
  var i;
  this.last = val;
  for (i = 0; i < this.cbListeners.length; ++i) {
    this.cbListeners[i](val);
  }
  for (i = 0; i < this.eventListeners.length; ++i) {
    this.eventListeners[i].body.run(val);
  }
};

Event.prototype.listen = function(cb) {
  this.cbListeners.push(cb);
};

Event.prototype.empty = function() {
  return new Event();
};

Event.prototype.concat = function(otherE) {
  var newE = new Event();
  newE.body = new NoopBody(newE);
  this.eventListeners.push(newE);
  otherE.eventListeners.push(newE);
  return newE;
};

Event.prototype.map = function(fn) {
  var newE = new Event();
  newE.body = new MapBody(fn, newE);
  this.eventListeners.push(newE);
  return newE;
};

Event.prototype.ap = function(valE) {
  var newE = new Event();
  newE.body = new ApBody(this, valE, newE);
  this.eventListeners.push(newE);
  valE.eventListeners.push(newE);
  return newE;
};

Event.prototype.of = function(val) {
  var newE = new Event();
  newE.last = val;
  return newE;
};

// Noop

function NoopBody(srcEv) {
  this.ev = srcEv;
}

NoopBody.prototype.run = function(v) {
  this.ev.push(v);
};

// Map

function MapBody(fn, srcEv) {
  this.fn = fn;
  this.ev = srcEv;
}

MapBody.prototype.run = function(v) {
  this.ev.push(this.fn(v));
};

// Apply

function ApBody(fnE, valE, ev) {
  this.fnE = fnE;
  this.valE = valE;
  this.ev = ev;
}

ApBody.prototype.run = function(v) {
  var fn = this.fnE.last, val = this.valE.last;
  if (fn !== undefined && val !== undefined) {
    this.ev.push(fn(val));
  }
};

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

function filter(pred, srcEv) {
  var filterEv = new Event();
  filterEv.body = new FilterBody(pred, filterEv);
  srcEv.eventListeners.push(filterEv);
  return filterEv;
}

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

function scan(fn, acc, srcEv) {
  var scanEv = new Event();
  scanEv.body = new ScanBody(fn, acc, scanEv);
  srcEv.eventListeners.push(scanEv);
  return scanEv;
}

module.exports = {
  Event: function() { return new Event(); },
  filter: filter,
  scan: scan,
  map: function(fn, srcEv) {
    return srcEv.map(fn);
  },
  ap: function(fnE, valE) {
    return fnE.ap(valE);
  },
  of: Event.prototype.of,
};
