require("ts-node/register");

/** @type {import("mocha").MochaOptions} */
exports.mocha = {
  ...(process.env.REPORT === "true"
    ? { reporter: require("../reporter.js") }
    : {}),
};

exports.helpers = {
  BaseExtend: {
    require: "../base-extend-helper.ts",
  },
};

exports.plugins = {
  screenshotOnFail: {
    enabled: false,
  },
  stepByStepReport: {
    enabled: true,
    deleteSuccessful: false,
  },
  stepTimeout: {
    enabled: true,
    timeout: 10,
  },
};

exports.config = {
  tests: "../../tests/**/*.ts",
  mocha: exports.mocha,
  helpers: exports.helpers,
  plugins: exports.plugins,
};
