const port = parseInt(process.env.PORT) || 4444;
const browser = process.env.BROWSER || "chrome";

const webdriverConfig = {
  desiredCapabilities: {
    chromeOptions: {
      args: [ "--disable-gpu", "--no-sandbox" ]
    }
  },
};

exports.WebDriver = {
  port,
  browser,
  path: "/",
  url: "http://localhost",
  restart: false,
  ...webdriverConfig
};