/// <reference path="../../../codeceptjs/steps.d.ts" />

import { equal, ok } from "assert";
import { expect } from "chai";
import snapshot from "snap-shot-it";

const helpers = codeceptjs.config.get("helpers");
const currentEngine: "webkit" | "firefox" | "chromium" =
  (helpers.Playwright || helpers.WebDriver).browser;

Feature("Color").tag("html/input/color");

const html = /*html*/ `
  <button id="start" aria-label="start">start</button>
  <input id="test" type="color" /><label for="test">Label</label>
`;

Scenario(
  "Should be targetable when having a label",
  async function (this: any, { I }) {
    if (currentEngine === "firefox") this.skip();

    I.setContent(html);

    if (helpers.ChromevoxHelper || helpers.VoiceOverHelper) {
      I.wait(2);
      I.focus("#start");
      I.nextItem();
    }

    const ax = await I.grabATOutput("#test");
    snapshot(ax as any);
    ok(ax);

    I.click("#test");
    snapshot((await I.grabATOutput("#test")) as any);
  }
).tag("targetable");

Scenario("Should have role", async function (this: any, { I }) {
  if (currentEngine === "firefox") this.skip();

  I.setContent(html);

  if (helpers.ChromevoxHelper || helpers.VoiceOverHelper) {
    I.wait(2);
    I.focus("#start");
    I.nextItem();
  }

  expect(await I.grabATOutput("#test")).to.have.role([
    "ColorWell",
    "color well",
  ]);
}).tag("role");

Scenario("Should have accessible name", async function (this: any, { I }) {
  if (currentEngine === "firefox") this.skip();

  I.setContent(html);

  if (helpers.ChromevoxHelper || helpers.VoiceOverHelper) {
    I.wait(2);
    I.focus("#start");
    I.nextItem();
  }

  expect(await I.grabATOutput("#test")).to.have.name("Label");
}).tag("name");
