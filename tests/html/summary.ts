/// <reference path="../../codeceptjs/steps.d.ts" />

import { equal, ok } from "assert";

Feature("Summary").tag('html/summary');

const html = /*html*/ `<details>
    <summary id="test">Summary title</summary>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi ipsum
    reprehenderit dolore quo autem ad eaque officia non quisquam vel.
</details>`;

Scenario("Should be targetable", async ({ I }) => {
  I.setContent(html);
  ok(await I.grabAXNode("#test"));
}).tag('targetable')

Scenario("Should be focusable", async ({ I }) => {
  I.setContent(html);
  I.pressKey("Tab");
  ok((await I.grabAXNode("#test"))?.focused);
}).tag('focusable')

Scenario("Should be expandable", async ({ I }) => {
  I.setContent(html);
  I.click("#test");
  equal((await I.grabAXNode("#test"))?.expanded, true);
}).tag('expandable');

Scenario("Should have role", async ({ I }) => {
  I.setContent(html);
  ok(
    ["Summary", "summary", "DisclosureTriangle"].includes(
      (await I.grabAXNode("#test"))?.role!
    )
  );
}).tag('role')

Scenario("Should have accessible name", async ({ I }) => {
  I.setContent(html);
  equal((await I.grabAXNode("#test"))?.name, "Summary title");
}).tag('name')
