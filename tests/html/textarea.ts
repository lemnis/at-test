/// <reference path="../../codeceptjs/steps.d.ts" />

import { equal, ok } from "assert";
import snapshot from "snap-shot-it";

Feature("Textarea").tag("html/textarea");

const html = /*html*/ `<textarea id="test"></textarea>`;

Scenario("Should be targetable", async ({ I }) => {
  I.setContent(html);
  const ax = await I.grabAXNode("#test");
  ok(ax);
  snapshot(ax);
}).tag("targetable");

Scenario("Should be focusable", async ({ I }) => {
  I.setContent(html);
  I.pressKey("Tab");
  ok((await I.grabAXNode("#test"))?.focused);
}).tag("focusable");

Scenario("Should have role", async ({ I }) => {
  I.setContent(html);
  equal((await I.grabAXNode("#test"))?.role, "textbox");
}).tag("role");

Scenario("Should be multiline", async ({ I }) => {
  I.setContent(html);
  ok((await I.grabAXNode("#test"))?.multiline);
}).tag("multiline");
