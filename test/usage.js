/*jslint indent: 2, maxlen: 80, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

module.exports = function usageDemo(require, console) {
  //#u
  var objectDepthFinder = require('objdepth'), report,
    compactJson = require('ersatz-compactjson'),
    aquarium = {},
    animals = {
      goldfish: { home: aquarium, swim: true },
      cat: { feet: 4, color: ['orange', 'white'] },
    },
    scanOpts = {
      hooks: {
        finishedBranch: objectDepthFinder.hook.toCleanArrays,
      },
      metaPath: true,
    };
  aquarium.fish = [ animals.goldfish ];
  report = objectDepthFinder(animals, scanOpts);
  console.log(compactJson(report));
  //#e
  usageDemo.data = animals;
  usageDemo.report = report;
};





if (require.main === module) { module.exports(require, console); }
