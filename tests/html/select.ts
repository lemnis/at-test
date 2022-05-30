/// <reference path="../../codeceptjs/steps.d.ts" />

import { equal, ok } from "assert";

Feature("Select").tag('html/select');

const html = (label?: string) => /*html*/ `<select
  id="test"
  ${label ? `aria-label="${label}"` : ''}
>
  <option>Apple</option>
</select>`;

Scenario("Should be targetable", async ({ I }) => {
  I.setContent(html());
  ok(await I.grabAXNode("#test"));
}).tag('targetable')

Scenario("Should be focusable", async ({ I }) => {
  I.setContent(html());
  I.pressKey("Tab");
  ok((await I.grabAXNode("#test"))?.focused);
}).tag('focusable')

Scenario("Should be expandable", async ({ I }) => {
  I.setContent(html());
  I.click("#test");
  equal((await I.grabAXNode("#test"))?.expanded, true);
}).tag('expandable');

Scenario("Should have value", async ({ I }) => {
  I.setContent(html());
  equal((await I.grabAXNode('#test'))?.value, 'Apple');
}).tag('role')

Scenario("Should have role", async ({ I }) => {
  I.setContent(html());
  equal((await I.grabAXNode('#test'))?.role, 'combobox');
}).tag('role')

Scenario("Should have accessible name", async ({ I }) => {
  I.setContent(html('Select label'));
  equal((await I.grabAXNode("#test"))?.name, "Select label");
}).tag('name')
