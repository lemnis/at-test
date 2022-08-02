require("ts-node/register");

const { setHeadlessWhen, setCommonPlugins } = require("@codeceptjs/configure");
const { mocha: baseMocha, plugins, helpers, config } = require("./base");
const { Playwright } = require("./playwright");

setHeadlessWhen(process.env.HEADLESS);
setCommonPlugins();

const browser = "chromium";
const output = `../../output/chromevox-${browser}`;

const pathToExtension = __dirname + '/chromevox-extension'

/** @type {import("mocha").MochaOptions} */
const mocha = {
  ...baseMocha,
  reporterOptions: {
    browser,
    ATVersion: require(pathToExtension + '/manifest.json').version,
    ATName: 'ChromeVox',
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
      chromium: {
        userDataDir: '../helpers/chromevox-user-data', // necessary to launch the browser in normal mode instead of incognito,
        args: [
          `--enable-experimental-web-platform-features`,
           `--disable-extensions-except=${pathToExtension}`,
           `--load-extension=${pathToExtension}`
        ]
      }
    },
    ChromeVox: {
      require: "../helpers/chromevox.ts",
    },
    BaseExtend: helpers.BaseExtend,
  },
  mocha,
  plugins
};
