// my-reporter.js

"use strict";

const Mocha = require("mocha");
const os = require("os");
const fs = require("fs");
const path = require("path");
const container = require("codeceptjs").container;

const { EVENT_RUN_END, EVENT_TEST_FAIL, EVENT_TEST_BEGIN, EVENT_TEST_PASS } =
  Mocha.Runner.constants;

// this reporter outputs test results, indenting two spaces per suite
class MyReporter {
  constructor(runner, options) {
    const config = options.override ? JSON.parse(options.override) : options;

    const driver = options.reporterOptions.driver || "Playwright";
    const ATName = options.reporterOptions.ATName || undefined;
    const ATVersion = options.reporterOptions.ATVersion || undefined;
    const browser =
      config.helpers?.Playwright.browser || options.reporterOptions.browser;

    let browserVersion;

    const json = {
      results: [],
      environment: {
        os: { name: os.platform(), version: os.release() },
        at: { name: ATName, version: ATVersion }
      },
    };

    runner
      .once(EVENT_TEST_PASS, () => {
        json.environment.browser = {
          name: browser,
          driver,
          version: (browserVersion = container
            .helpers("Playwright")
            .browser.version()),
        };
      })
      .once(EVENT_TEST_FAIL, () => {
        json.environment.browser = {
          name: browser,
          driver,
          version: (browserVersion = container
            .helpers("Playwright")
            .browser.version()),
        };
      })
      .on(EVENT_TEST_BEGIN, (test) => {
        console.log(test.tags, 'start');
      })
      .on(EVENT_TEST_PASS, (test) => {
        json.results.push({
          id: test.tags.map((i) => i.replace(/@/g, "")).join("/"),
          pass: true,
        });
        console.log(test.tags, true);
      })
      .on(EVENT_TEST_FAIL, (test, err) => {
        json.results.push({
          id: test.tags.map((i) => i.replace(/@/g, "")).join("/"),
          pass: false,
        });
        console.log(test.tags, false);
      })
      .once(EVENT_RUN_END, () => {
        const folder = path.join(
          __dirname,
          "../",
          "output",
          `${driver}-${browser}`.toLowerCase()
        );
        const p = path.join(
          folder,
          `${os.platform()}-${browser}-latest.json`.toLowerCase()
        );
        console.log(json);
        const o = path.join(
          folder,
          `${os.platform()}-${browser}-${browserVersion}.json`.toLowerCase()
        );
        fs.writeFileSync(p, JSON.stringify(json, null, 2));
        fs.writeFileSync(o, JSON.stringify(json, null, 2));
      });
  }
}

module.exports = MyReporter;
