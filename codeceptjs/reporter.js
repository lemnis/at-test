// my-reporter.js

"use strict";

const Mocha = require("mocha");
const os = require("os");
const fs = require("fs");
const path = require("path");
const container = require("codeceptjs").container;

const {
  EVENT_RUN_END,
  EVENT_TEST_FAIL,
  EVENT_TEST_BEGIN,
  EVENT_TEST_PASS,
  EVENT_SUITE_BEGIN,
} = Mocha.Runner.constants;

const getBrowserVersion = (container) => {
  return (
    container.helpers("Playwright")?.browser?.version?.() ||
    container.helpers("WebDriver")?.browser?.capabilities?.browserVersion
  );
};

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
        at: { name: ATName, version: ATVersion },
      },
    };

    runner
      .once(EVENT_TEST_PASS, () => {
        json.environment.browser = {
          name: browser,
          driver,
          version: (browserVersion = getBrowserVersion(container)),
        };
      })
      .once(EVENT_TEST_FAIL, () => {
        json.environment.browser = {
          name: browser,
          driver,
          version: (browserVersion = getBrowserVersion(container)),
        };
      })
      .on(EVENT_TEST_PASS, (test) => {
        if(!(test?.tags || test?._retriedTest?.tags)?.length) console.log(`Test is missing tags`, test.title, 'at', test.file, test);
        json.results.push({
          id: (test.tags || test._retriedTest.tags)?.map((i) => i.replace(/@/g, "")).join("/"),
          pass: true,
        });
      })
      .on(
        EVENT_TEST_FAIL,
        /**
         * @param {Mocha.Test} test
         * @param {Error} err
         */
        (test, err) => {
          console.log(`✖ ${test.title}`);
          console.log(err);
          if(!(test?.tags || test?._retriedTest?.tags)?.length) console.log(`Test is missing tags`, test.title, 'at', test.file, test);
          console.log();
          json.results.push({
            id: (test.tags || test._retriedTest.tags)?.map((i) => i.replace(/@/g, "")).join("/"),
            pass: false,
          });
        }
      )
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
        console.log(`Saved at ${p}`);
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
