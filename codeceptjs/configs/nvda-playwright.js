require("ts-node/register");

const { setHeadlessWhen, setCommonPlugins } = require("@codeceptjs/configure");
const { mocha: baseMocha, plugins, helpers, config } = require("./base");
const { Playwright } = require("./playwright");

setHeadlessWhen(process.env.HEADLESS);
setCommonPlugins();

const browser = process.env.BROWSER || "chromium";
const output = `../../output/nvda-${browser}`;

/** @type {import("mocha").MochaOptions} */
const mocha = {
  ...baseMocha,
  reporterOptions: {
    browser,
    ATName: 'NVDA',
    driver: 'nvda',
  },
};

exports.config = {
  name: "chromevox",
  tests: config.tests,
  output,
  helpers: {
    Playwright: {
      ...Playwright,
      show: true,
      restart: true,
    },
    NVDA: {
      require: "../helpers/nvda.ts",
    },
    BaseExtend: helpers.BaseExtend,
  },
  mocha,
  plugins
};
