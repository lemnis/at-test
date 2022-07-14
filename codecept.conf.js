require("ts-node/register");

const { setHeadlessWhen, setCommonPlugins } = require("@codeceptjs/configure");

// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
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

exports.config = {
  name: "computed-aria",
  tests: "tests/**/*.ts",
  output,
  helpers: {
    Playwright: {
      url: "http://localhost",
      browser,
      show: false,
      restart: false,
      ...playwrightConfig
    },
    BaseExtend: {
      require: "./codeceptjs/base-extend-helper.ts",
    },
    Accessibility: {
      require: "./codeceptjs/a11y-helper.ts",
    },
  },
  mocha: { reporterOptions: { browser } },
};
