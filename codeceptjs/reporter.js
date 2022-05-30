// my-reporter.js

"use strict";

const Mocha = require("mocha");
const os = require("os");
const fs = require("fs");
const path = require("path");
const container = require('codeceptjs').container;

const {
  EVENT_RUN_BEGIN,
  EVENT_RUN_END,
  EVENT_TEST_FAIL,
  EVENT_TEST_PASS,
  EVENT_SUITE_BEGIN,
  EVENT_SUITE_END,
} = Mocha.Runner.constants;

// this reporter outputs test results, indenting two spaces per suite
class MyReporter {
  constructor(runner, options) {
    this._indents = 0;
    const stats = runner.stats;

    
    const config = options.override
    ? JSON.parse(options.override) : options;

    const driver = 'Playwright';
    
    const browser = options.override
      ? config.helpers.Playwright.browser
      : options.reporterOptions.browser;

    let browserVersion;
    
    
      const json = {
      results: [],
      environment: {
        os: { name: os.platform(), version: os.release() },
      },
    };

    runner
      .once(EVENT_TEST_PASS, () => {
        json.environment.browser = {
          name: browser,
          driver: "Playwright",
          version: browserVersion = container.helpers('Playwright').browser.version()
        }
      })
      .on(EVENT_TEST_PASS, (test) => {
        json.results.push({
          id: test.tags.map((i) => i.replace(/@/g, "")).join("/"),
          pass: true,
        });
        // Test#fullTitle() returns the suite name(s)
        // prepended to the test title
        // console.log(`${this.indent()}pass: ${test.fullTitle()}`);
      })
      .on(EVENT_TEST_FAIL, (test, err) => {
        json.results.push({
          id: test.tags.map((i) => i.replace(/@/g, "")).join("/"),
          pass: false,
        });
        // console.log(
        //   `${this.indent()}fail: ${test.fullTitle()} - error: ${err.message}`
        // );
      })
      .once(EVENT_RUN_END, () => {
        const p = path.join(__dirname, '../', 'output', `${driver}-${browser}`.toLowerCase(), `${driver}-${os.platform()}-${browser}-latest.json`.toLowerCase());
        const o = path.join(__dirname, '../', 'output', `${driver}-${browser}`.toLowerCase(), `${driver}-${os.platform()}-${browser}-${browserVersion}.json`.toLowerCase());
        fs.writeFileSync(p, JSON.stringify(json, null, 2))
        fs.writeFileSync(o, JSON.stringify(json, null, 2))
      });
  }

  indent() {
    return Array(this._indents).join("  ");
  }

  increaseIndent() {
    this._indents++;
  }

  decreaseIndent() {
    this._indents--;
  }
}

module.exports = MyReporter;
