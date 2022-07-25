require("ts-node/register");

const { setCommonPlugins } = require("@codeceptjs/configure");
const fs = require("fs");
const plist = require("plist");

setCommonPlugins();

const port = parseInt(process.env.PORT) || 4444;
const browser = process.env.BROWSER || "chrome";
const output = `../../output/voiceover-${browser}`;
const ATVersion = plist.parse(fs.readFileSync('/System/Library/CoreServices/VoiceOver.app/Contents/version.plist', 'utf-8'))?.CFBundleVersion;

const webdriverConfig = {
  desiredCapabilities: {
    chromeOptions: {
      args: [ "--disable-gpu", "--no-sandbox" ]
    }
  },
};

/** @type {import("mocha").MochaOptions} */
const mocha = {
  reporterOptions: {
    browser,
    ATVersion,
    ATName: 'VoiceOver',
    driver: 'VoiceOver',
  },
  allowUncaught: true,
  timeout: 4000,
  ...(process.env.REPORT === "true"
    ? { reporter: require("../reporter.js") }
    : {}),
};

exports.config = {
  name: "voiceover",
  tests: "../../tests/**/*.ts",
  output,
  helpers: {
    WebDriver: {
      port,
      browser,
      path: "/",
      url: "http://localhost",
      restart: false,
      ...webdriverConfig
    },
    BaseExtend: {
      require: "../base-extend-helper.ts",
    },
    VoiceOverHelper: {
      require: "../voiceover-helper.ts",
    },
  },
  mocha,
  plugins: {
    screenshotOnFail: {
      enabled: false,
    }
  },
};
