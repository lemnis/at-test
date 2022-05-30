/// <reference path="../../codeceptjs/steps.d.ts" />

import { equal, ok } from "assert";
import snapshot from "snap-shot-it";

Feature("Abbr").tag("html/abbr");

const html = /*html*/ `<abbr id="test" title="Cascading Style Sheets">CSS</abbr>`;

Scenario("Should be targetable", async ({ I }) => {
  I.setContent(html);
  const ax = await I.grabAXNode('#test');
  ok(ax);
}).tag("targetable");

Scenario("Should be full name", async ({ I }) => {
  I.setContent(html);
  const ax = await I.grabAXNode();
  snapshot(ax as any);
  snapshot(await I.grabAXNode(undefined, true) as any);
  equal(ax?.children?.[0]?.name, "Cascading Style Sheets");
}).tag("name");

Scenario("Should have role", async ({ I }) => {
  I.setContent(html);
  ok(["Abbr", "text", "Inline"].includes((await I.grabAXNode("#test"))?.role!));
}).tag("role");
