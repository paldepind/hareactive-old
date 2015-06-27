function Event() {
  this.cbListeners = [];
  this.eventListeners = [];
  this.last = undefined;
  this.body = undefined;
}

Event.prototype.push = function(val) {
  var i; this.last = val;
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
  newE.body = new MapBody(fn, newE, this);
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

// Noop body

function NoopBody(srcEv) {
  this.ev = srcEv;
}

NoopBody.prototype.run = function(v) {
  this.ev.push(v);
};

// Map body

function MapBody(fn, ownE, srcE) {
  this.fn = fn;
  this.ev = ownE;
  this.srcE = srcE;
}

MapBody.prototype.run = function(v) {
  this.ev.push(this.fn(v));
};

MapBody.prototype.pull = function() {
  return this.fn(this.srcE.last !== undefined ? this.srcE.last : this.srcE.body.pull());
};

// Apply body

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

function TFun(fn, k) {
  this.fn = fn;
  this.k = k;
}

function K(k) {
  return new TFun(undefined, k);
}

function Fun(fn) {
  return new TFun(fn, undefined);
}

function Behavior(tFun) {
  this.cbListeners = [];
  this.eventListeners = [];
  if (tFun instanceof TFun) {
    this.last = undefined;
    this.body = new PullBody(tFun.fn);
  } else {
    this.last = tFun;
    this.body = new PullBody(undefined);
  }
}

Behavior.prototype.push = Event.prototype.push;
Behavior.prototype.listen = Event.prototype.listen;

Behavior.prototype.clear = function() {
  if (this.last !== undefined) {
    var i; this.last = undefined;
    for (i = 0; i < this.eventListeners.length; ++i) {
      this.eventListeners[i].clear();
    }
  }
};

Behavior.prototype.map = function(fn) {
  var newB = new Behavior(this.last !== undefined ? fn(this.last) : undefined);
  newB.body = new MapBody(fn, newB, this);
  this.eventListeners.push(newB);
  return newB;
};

Behavior.prototype.ap = function(valE) {
  var newB = new Behavior();
  newB.body = new ApBody(this, valE, newB);
  this.eventListeners.push(newB);
  valE.eventListeners.push(newB);
  return newB;
};

Behavior.prototype.of = function(val) {
  return new Behavior(val);
};

// PullBehavior

function PullBody(fn) {
  this.fn = fn;
}

PullBody.prototype.pull = function() {
  return this.fn();
};

module.exports = {
  Behavior: {
    Behavior: function(v) {
      return new Behavior(v);
    },
    K: K,
    Fun: Fun,
    of: Behavior.prototype.of,
    set: function(b, fn) {
      b.clear();
      b.body.fn = fn;
    },
    at: function(b) {
      return b.last !== undefined ? b.last : b.body.pull();
    },
  },
  Event: {
    Event: function() { return new Event(); },
    of: Event.prototype.of,
  },
};
