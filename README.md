
<!--#echo json="package.json" key="name" underline="=" -->
objdepth
========
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
Analyze any value for how deep an object structure it contains and where there
might be recursion. Formerly known as object-depth-finder.
<!--/#echo -->


Usage
-----
from [test/usage.js](test/usage.js):

<!--#include file="test/usage.js" start="  //#u" stop="  //#e"
  outdent="  " code="javascript" -->
<!--#verbatim lncnt="18" -->
```javascript
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
```
<!--/include-->

Result:

<!--#include file="test/usage.dump.json" code="json" -->
<!--#verbatim lncnt="30" -->
```json
[ { "level": 0, "type": "object", "depth": 4,
    "path": [] },
  [ { "level": 1, "idx": 0, "key": "goldfish", "type": "object", "depth": 3,
      "path": [ "goldfish" ] },
    [ { "level": 2, "idx": 0, "key": "home", "type": "object", "depth": 2,
        "path": [ "goldfish", "home" ] },
      [ { "level": 3, "idx": 0, "key": "fish", "type": "object", "depth": 1,
          "path": [ "goldfish", "home", "fish" ] },
        [ { "level": 4, "idx": 0, "type": "object", "depth": -3,
            "path": [ "goldfish", "home", "fish", 0 ] },
          "<(circular)>" ] ] ],
    [ { "level": 2, "idx": 1, "key": "swim", "type": "boolean", "depth": 0,
        "path": [ "goldfish", "swim" ] },
      true ] ],
  [ { "level": 1, "idx": 1, "key": "cat", "type": "object", "depth": 2,
      "path": [ "cat" ] },
    [ { "level": 2, "idx": 0, "key": "feet", "type": "number", "depth": 0,
        "path": [ "cat", "feet" ] },
      4 ],
    [ { "level": 2, "idx": 1, "key": "color", "type": "object", "depth": 1,
        "path": [ "cat", "color" ] },
      [ { "level": 3, "idx": 0, "type": "string", "depth": 0,
          "path": [ "cat", "color", 0 ] },
        "orange" ],
      [ { "level": 3, "idx": 1, "type": "string", "depth": 0,
          "path": [ "cat", "color", 1 ] },
        "white" ] ] ] ]

```
<!--/include-->


Options
-------

  * `circular`: (any value)
    What to put in the value slot for a circular reference.
    Choose something that, when you see it in your debug dump, reminds you
    to double-check the `depth` of that object.
    If the `depth` is zero or positive, your tree really contains this value.
    If the `depth` is negative, your tree references the object
    `Math.abs(depth)` levels up.
    Default: `<(circular)>`
  * `hooks`: (false or object) Meddle with scanning, see below.
  * `metaPath`: (bool) Whether to include the `path` property in meta data.
  * `sortKeys`: (bool or func) Secret ninja option.




Hooks
-----
Still beta, but the one shown in the usage example is there to stay.

Search [the source](odf.js) for `.hook(` to find event names,
and for `.hook.` to find some included handlers.







<!--#toc stop="scan" -->


  [compact-json]: https://www.npmjs.com/package/compact-json


License
-------
<!--#echo json="package.json" key=".license" -->
ISC
<!--/#echo -->
