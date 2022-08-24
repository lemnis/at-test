require("ts-node/register");

const { setHeadlessWhen, setCommonPlugins } = require("@codeceptjs/configure");

// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

exports.config = {
  tests: "./tests/**/*.ts",
  output: "./output",
  helpers: {
    WebDriver: {
      port: 4444,
      browser: "firefox",
      path: "/",
      url: "http://localhost",
      desiredCapabilities: {
        chromeOptions: {
          args: [
            "--disable-gpu",
            "--no-sandbox",
            "--disable-dev-shm-usage",
            '--force-renderer-accessibility'
          ],
        },
      },
      restart: false,
    },
    BaseExtend: {
      require: "./codeceptjs/base-extend-helper.ts",
    },
    Accessibility: {
      require: "./codeceptjs/a11y-helper.ts",
    },
  },
  include: {
    I: "./steps_file.js",
  },
  bootstrap: null,
  mocha: {},
  name: "caniat",
};
