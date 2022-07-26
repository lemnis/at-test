require("ts-node/register");

const { setHeadlessWhen, setCommonPlugins } = require("@codeceptjs/configure");
const { config, helpers, plugins, mocha: baseMocha  } = require("./base.js");

setHeadlessWhen(process.env.HEADLESS);
setCommonPlugins();

const browser = process.env.BROWSER || "chromium";
const output = `./output/playwright-${browser}`;

/** @type {import("playwright").LaunchOptions} */
let playwrightConfig = {
  // slowMo: 4000,
  chromium: {
    args: [`--enable-experimental-web-platform-features`],
  },
  firefox: {
    firefoxUserPrefs: {
      "accessibility.AOM.enabled": true,
    },
  },
  webkit: {},
};

exports.Playwright = {
  url: "http://localhost",
  browser,
  show: false,
  restart: false,
  ...playwrightConfig,
};

/** @type {import("mocha").MochaOptions} */
const mocha = {
  ...baseMocha,
  reporterOptions: { browser },
};

exports.config = {
  name: "playwright",
  tests: config.tests,
  output,
  helpers: {
    Playwright: exports.Playwright,
    BaseExtend: helpers.BaseExtend,
    InternalBrowser: {
      require: "../internal-browser-helper",
    },
  },
  mocha,
  plugins,
};
