require("ts-node/register");

const { setHeadlessWhen, setCommonPlugins } = require("@codeceptjs/configure");

// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

const browser = process.env.BROWSER || "chromium";

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

exports.config = {
  tests: "tests/**/*.ts",
  output: "./output",
  helpers: {
    Playwright: {
      url: "http://localhost",
      browser,
      show: false,
      restart: false,
      ...playwrightConfig
    },
    Accessibility: {
      require: "./codeceptjs/a11y-helper.ts",
    },
  },
  multiple: {
    all: {
      browsers: [
        { browser: "firefox" },
        { browser: "webkit" },
        { browser: "chromium" },
      ],
    },
  },
  bootstrap: null,
  mocha: {
    // reporter: "./codeceptjs/reporter.js",
    reporterOptions: {
      browser,
    },
  },
  name: "computed-aria",
  plugins: {
    pauseOnFail: {},
    retryFailedStep: {
      enabled: true,
    },
    tryTo: {
      enabled: true,
    },
    screenshotOnFail: {
      enabled: false,
    },
  },
};
