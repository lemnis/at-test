require("ts-node/register");

const { setCommonPlugins } = require("@codeceptjs/configure");

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

const browser = "chromium";
const output = `./output/playwright-chromevox`;

const extensionPath =
  "/home/lisa/snap/chromium/common/chromium/Default/Extensions/kgejglhpjiefppelpmljglcjbhoiplfn/53.0.2784.13_0/";

/** @type {import("playwright").LaunchOptions} */
let playwrightConfig = {
  slowMo: 3000,
  headless: false,
  chromium: {
    userDataDir: '/tmp/playwright-tmp',
    args: [`--disable-extensions-except=${extensionPath}`]
  }
};

exports.config = {
  name: "computed-aria",
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
    ChromevoxHelper: {
      require: "./codeceptjs/chromevox-helper.ts",
    },
  },
  mocha: { reporterOptions: { browser } },
};
