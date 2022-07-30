require("ts-node/register");

const { setCommonPlugins } = require("@codeceptjs/configure");
const { mocha: baseMocha, plugins, config, helpers } = require("./base");
const { ATVersion, ATName, VoiceOver } = require("./voiceover.cjs");
const { WebDriver } = require("./webdriver.cjs");

setCommonPlugins();

const browser = process.env.BROWSER || "chrome";
const output = `../../output/voiceover-${browser}`;

/** @type {import("mocha").MochaOptions} */
const mocha = {
  ...baseMocha,
  reporterOptions: {
    browser,
    ATVersion,
    ATName,
    driver: 'VoiceOver',
  }
};

exports.config = {
  name: "voiceover",
  tests: config.tests,
  output,
  helpers: {
    WebDriver,
    BaseExtend: helpers.BaseExtend,
    VoiceOver,
  },
  mocha,
  plugins
};
