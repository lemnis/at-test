/// <reference path="../../codeceptjs/steps.d.ts" />

import { equal, ok } from "assert";

Feature("Meter").tag("html/meter");

const html = () => /*html*/ `<meter id="test"></meter>`;
const htmlWithLabel = () =>
  /*html*/ `<meter id="test"></meter><label for="test">Label</label>`;

Scenario("Should be targetable when having a label", async ({ I }) => {
  I.setContent(htmlWithLabel());
  ok(await I.grabAXNode("#test", true));
  I.setContent(html());
  equal(await I.grabAXNode("#test"), undefined);
}).tag("targetable");

Scenario("Should have role", async ({ I }) => {
  I.setContent(htmlWithLabel());
  equal((await I.grabAXNode("#test"))?.role, "meter");
}).tag("role");

Scenario("Should have accessible name", async ({ I }) => {
  I.setContent(htmlWithLabel());
  equal((await I.grabAXNode("#test"))?.name, "Label");
}).tag("name");

Scenario.todo("Shoud convey low range").tag("value");
