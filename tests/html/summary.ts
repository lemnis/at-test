/// <reference path="../../codeceptjs/steps.d.ts" />

import { equal, ok } from "assert";
import { expect } from "../utils/expect";

Feature("Summary").tag("html/summary");

const helpers = codeceptjs.config.get("helpers");

const html = /*html*/ `<details>
    <summary id="test">Title</summary>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi ipsum
    reprehenderit dolore quo autem ad eaque officia non quisquam vel.
</details>`;

Scenario("Should be targetable", async ({ I }) => {
  I.setContent(html);
  ok(await I.grabAXNode("#test"));
}).tag("targetable");

Scenario("Should be focusable", async ({ I }) => {
  I.setContent(html);
  I.pressKey("Tab");
  ok((await I.grabAXNode("#test"))?.focused);
}).tag("focusable");

Scenario("Should be expandable", async ({ I }) => {
  I.setContent(html);
  I.click("#test");
  equal((await I.grabAXNode("#test"))?.expanded, true);
}).tag("expandable");

Scenario("Should have role", async ({ I }) => {
  I.setContent(html);

  if (helpers.ChromevoxHelper) {
    I.wait(2);
    I.nextItem();
    I.nextItem();
  }

  expect(await I.grabATOutput("#test")).to.have.role(["Summary", "summary", "DisclosureTriangle"]);
}).tag("role");

Scenario("Should have accessible name", async ({ I }) => {
  I.setContent(html);

  if (helpers.ChromevoxHelper) {
    I.wait(2);
    I.nextItem();
    I.nextItem();
  }

  expect(await I.grabATOutput("#test")).to.have.name("Summary title");
}).tag("name");
