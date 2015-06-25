function Event() {
  this.cbListeners = [];
  this.eventListeners = [];
  this.body = undefined;
}

Event.prototype.push = function(val) {
  var i;
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

// Map

function MapBody(fn, srcEv) {
  this.fn = fn;
  this.ev = srcEv;
}

MapBody.prototype.run = function(v) {
  this.ev.push(this.fn(v));
};

function map(fn, srcEv) {
  var mapEv = new Event();
  mapEv.body = new MapBody(fn, mapEv);
  srcEv.eventListeners.push(mapEv);
  return mapEv;
}

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
  map: map,
};
