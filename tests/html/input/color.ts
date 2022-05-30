/// <reference path="../../../codeceptjs/steps.d.ts" />

import { equal, ok } from "assert";
import snapshot from "snap-shot-it";

const currentEngine: "webkit" | "firefox" | "chromium" = codeceptjs.config.get("helpers").Playwright.browser;

Feature("Color").tag("html/input/color");

const html = /*html*/ `<input id="test" type="color" /><label for="test">Label</label>`;

Scenario("Should be targetable when having a label", async function (this: any, { I }) {
  if(currentEngine === 'firefox') this.skip();

  I.setContent(html);
  const ax = await I.grabAXNode('#test');
  snapshot(ax as any);
  ok(ax);

  I.click("#test");
  snapshot(await I.grabAXNode('#test') as any);
}).tag("targetable");

Scenario("Should have role", async function (this: any, { I }) {
  if(currentEngine === 'firefox') this.skip();

  I.setContent(html);
  equal((await I.grabAXNode("#test"))?.role, "ColorWell");
}).tag("role");

Scenario("Should have accessible name", async function (this: any, { I }) {
  if(currentEngine === 'firefox') this.skip();

  I.setContent(html);
  equal((await I.grabAXNode("#test"))?.name, "Label");
}).tag("name");
