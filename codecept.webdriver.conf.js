require("ts-node/register");

const { setHeadlessWhen } = require("@codeceptjs/configure");

// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

const browser = process.env.BROWSER || "chromium";
const output = `./output/webdriver-${browser}`;

exports.config = {
  name: "computed-aria",
  tests: "tests/**/*.ts",
  output,
  helpers: {
    WebDriver: {
      port: 9515,
      browser: "chrome",
      path: "/",
      url: "http://localhost",
      desiredCapabilities: {
        chromeOptions: {
          args: [ "--headless", "--disable-gpu", "--no-sandbox" ]
        }
      },
      restart: false
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
