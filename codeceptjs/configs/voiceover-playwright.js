require("ts-node/register");

const { setHeadlessWhen, setCommonPlugins } = require("@codeceptjs/configure");
const { mocha: baseMocha, plugins, helpers, config } = require("./base");
const { Playwright } = require("./playwright");
const { ATVersion, ATName, VoiceOver } = require('./voiceover.cjs');

setHeadlessWhen(process.env.HEADLESS);
setCommonPlugins();

const browser = process.env.BROWSER || "chromium";
const output = `../../output/voiceover-${browser}`;

/** @type {import("mocha").MochaOptions} */
const mocha = {
  ...baseMocha,
  reporterOptions: {
    browser,
    ATVersion,
    ATName,
  },
};

exports.config = {
  name: "voiceover",
  tests: config.tests,
  output,
  helpers: {
    Playwright: {
      ...Playwright,
      show: true
    },
    BaseExtend: helpers.BaseExtend,
    VoiceOver
  },
  mocha,
  plugins
};
