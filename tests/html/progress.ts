/// <reference path="../../codeceptjs/steps.d.ts" />

import { equal, ok } from "assert";

Feature("Progress").tag("html/progress");

const html = () => /*html*/ `<progress id="test"></progress>`;
const htmlWithLabel = () => /*html*/ `<progress id="test"></progress><label for="test">Label</label>`;

Scenario("Should be targetable when having a label", async ({ I }) => {
  I.setContent(htmlWithLabel());
  ok(await I.grabAXNode("#test"));
  I.setContent(html());
  equal(await I.grabAXNode("#test"), undefined);
}).tag("targetable");

Scenario("Should have role", async ({ I }) => {
  I.setContent(htmlWithLabel());
  equal((await I.grabAXNode("#test"))?.role, "progressbar");
}).tag("role");

Scenario("Should have accessible name", async ({ I }) => {
  I.setContent(htmlWithLabel());
  equal((await I.grabAXNode("#test"))?.name, "Label");
}).tag("name");

Scenario.todo('Shoud convey current value').tag("value");
Scenario.todo('Shoud convey indeterminate state').tag("indeterminate");
