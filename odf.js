/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

module.exports = (function () {
  var EX;

  EX = function objectDepthFinder(x, opt) {
    opt = Object.assign({}, EX.defaultOpts, opt);
    if (!opt.hooks) { opt.hooks = false; }
    return EX.scanBranch(EX.prepareBranch(x, opt), opt);
  };


  EX.defaultOpts = {
    circular: '<(circular)>',
    hooks: false,
    metaPath: false,
    sortKeys: false,
  };


  EX.id = function identity(x) { return x; };
  EX.id.l8r = function (x) { return EX.id.bind(null, x); };
  EX.getProp = function (prop) {
    return function (obj) { return obj[prop]; };
  };


  EX.prepareBranch = function (x, opt) {
    var br = [], meta = {
      level: 0,
      idx: undefined,
      // ^-- undef values arrange order for nodejs's internal
      //     JSON.stringify() if set later but won't show up if not set.
      key: undefined,
      type: EX.typeOf(x),
      depth: 0,
      brak: undefined,
      path: (opt.metaPath ? null : undefined),
    };
    br.meta = meta;
    br.parent = null;
    br.data = EX.id.l8r(x);
    return br;
  };


  EX.typeOf = function (x) {
    if (x === null) { return String(x); }
    var t = typeof x;
    if ((t === 'number') && isNaN(x)) { return String(x); }
    return t;
  };


  EX.scanBranch = function (br, opt) {
    var meta = br.meta, data = br.data(), circ;
    if (opt.metaPath && (!meta.path)) { meta.path = []; }
    if (meta.type === 'object') {
      circ = EX.findCircHops(br, data);
      if (circ) {
        br.meta.depth = -circ;
        br.push(opt.circular);
        EX.hook('circular', opt, br);
      } else {
        br.keys = (Array.isArray(data) ? 0 : Object.keys(data));
        (br.keys ? EX.prepareArray : EX.prepareObj)(br, opt);
        EX.scanContainer(br, opt);
      }
    }
    EX.hook('finishedBranch', opt, br);
    return br;
  };


  EX.findCircHops = function (br, x) {
    var circUp = 0;
    if (!x) { x = br.data(); }
    while (true) {
      if (!br.parent) { return 0; }
      br = br.parent();
      circUp += 1;
      if (x === br.data()) { return circUp; }
    }
  };


  EX.scanContainer = function (br, opt) {
    EX.hook('beforeDive', opt, br);
    var meta = br.meta, data = br.data(),
      childrenLevel = meta.level + 1,
      maxChildDepth = 0;
    (br.keys || data).forEach(function (keyOrVal, idx) {
      var val = (br.keys ? data[keyOrVal] : keyOrVal),
        sub = EX.prepareBranch(val, opt),
        sume = sub.meta;
      sub.parent = EX.id.l8r(br);
      if (opt.metaPath) {
        sume.path = meta.path.concat([br.keys ? keyOrVal : idx]);
      }
      sume.level = childrenLevel;
      if (br.keys) { sume.key = keyOrVal; }
      sume.idx = idx;
      EX.scanBranch(sub, opt);
      if (sume.depth > maxChildDepth) { maxChildDepth = sume.depth; }
      br.push(sub);
    });
    meta.depth = 1 + maxChildDepth;
    EX.hook('afterDive', opt, br);
  };


  EX.hook = function (when, opt, br, details) {
    var hndList = opt.hooks[when], prevResult;
    if (!hndList) { return; }
    if (!Array.isArray(hndList)) { hndList = opt.hooks[when] = [hndList]; }
    br = [br];
    if (details) { br = br.concat(details); }
    hndList.forEach(function (hndFunc, result) {
      if (hndFunc.apply) {
        result = hndFunc.apply(opt, br);
        if (result !== undefined) { prevResult = result; }
      }
    });
    return prevResult;
  };


  EX.prepareArray = function (br, opt) {
    EX.hook('cleanupArray', opt, br);
  };


  EX.prepareObj = function (br, opt) {
    EX.hook('cleanupObject', opt, br);
    br.keys = (EX.hook('filterKeys', opt, br, br.keys) || br.keys);
    if (opt.sortKeys) {
      if (opt.sortKeys === true) {
        br.keys.sort();
      } else {
        br.keys.sort(opt.sortKeys.bind(br));
      }
    }
  };


  EX.hook.toCleanArrays = function (br) {
    var meta = br.meta, data = br.data();
    delete br.data;
    delete br.keys;
    delete br.meta;
    delete br.parent;
    br.unshift(meta);
    if (meta.type !== 'object') { br.push(data); }
  };














  return EX;
}());
