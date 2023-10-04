// @ts-check

"use strict";

const test = require("ava").default;
const path = require("node:path");
const resolveAndRequire = require("../resolve-and-require");

/* eslint-disable n/no-missing-require */

test("built-in module", (t) => {
  t.plan(1);
  t.deepEqual(
    require("node:fs"),
    resolveAndRequire(require, "fs", [ __dirname ])
  );
});

test("locally-installed module", (t) => {
  t.plan(1);
  t.deepEqual(
    require("markdownlint"),
    resolveAndRequire(require, "markdownlint", [ __dirname ])
  );
});

test("relative (to __dirname) path to module", (t) => {
  t.plan(1);
  t.deepEqual(
    require("./customRules/node_modules/markdownlint-rule-sample-commonjs"),
    resolveAndRequire(
      require,
      "./customRules/node_modules/markdownlint-rule-sample-commonjs",
      [ __dirname ]
    )
  );
});

test("module in alternate node_modules", (t) => {
  t.plan(2);
  t.throws(
    // @ts-ignore
    () => require("markdownlint-rule-sample-commonjs"),
    { "code": "MODULE_NOT_FOUND" }
  );
  t.deepEqual(
    require("./customRules/node_modules/markdownlint-rule-sample-commonjs"),
    resolveAndRequire(
      require,
      "markdownlint-rule-sample-commonjs",
      [ path.join(__dirname, "customRules") ]
    )
  );
});

test("module in alternate node_modules and no require.resolve.paths", (t) => {
  t.plan(2);
  // @ts-ignore
  delete require.resolve.paths;
  t.throws(
    // @ts-ignore
    () => require("markdownlint-rule-sample-commonjs"),
    { "code": "MODULE_NOT_FOUND" }
  );
  t.deepEqual(
    require("./customRules/node_modules/markdownlint-rule-sample-commonjs"),
    resolveAndRequire(
      require,
      "markdownlint-rule-sample-commonjs",
      [ path.join(__dirname, "customRules") ]
    )
  );
});

test("module local, relative, and in alternate node_modules", (t) => {
  t.plan(3);
  const dirs = [
    __dirname,
    path.join(__dirname, "customRules")
  ];
  t.deepEqual(
    require("markdownlint"),
    resolveAndRequire(require, "markdownlint", dirs)
  );
  t.deepEqual(
    require("./customRules/node_modules/markdownlint-rule-sample-commonjs"),
    resolveAndRequire(
      require,
      "./customRules/node_modules/markdownlint-rule-sample-commonjs",
      dirs
    )
  );
  t.deepEqual(
    require("./customRules/node_modules/markdownlint-rule-sample-commonjs"),
    resolveAndRequire(
      require,
      "markdownlint-rule-sample-commonjs",
      dirs
    )
  );
});
