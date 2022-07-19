require("ts-node/register");

const { setHeadlessWhen, setCommonPlugins } = require("@codeceptjs/configure");
const fs = require("fs");
const plist = require("plist");

// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

const browser = process.env.BROWSER || "chromium";
const output = `./output/voiceover-${browser}`;

/** @type {import("playwright").LaunchOptions} */
let playwrightConfig = {
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

/** @type {import("mocha").MochaOptions} */
const mocha = {
  reporterOptions: {
    browser,
    ATVersion: plist.parse(fs.readFileSync('/System/Library/CoreServices/VoiceOver.app/Contents/version.plist', 'utf-8'))?.CFBundleVersion,
    ATName: 'VoiceOver'
  },
  ...(process.env.REPORT === "true"
    ? { reporter: require("./codeceptjs/reporter.js") }
    : {}),
};

exports.config = {
  name: "voiceover",
  tests: "tests/**/*.ts",
  output,
  helpers: {
    Playwright: {
      url: "http://localhost",
      browser,
      show: true,
      restart: false,
      ...playwrightConfig,
    },
    BaseExtend: {
      require: "./codeceptjs/base-extend-helper.ts",
    },
    VoiceOverHelper: {
      require: "./codeceptjs/voiceover-helper.ts",
    },
  },
  mocha,
  plugins: {
    screenshotOnFail: {
      enabled: false,
    },
  },
};
