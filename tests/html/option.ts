/// <reference path="../../codeceptjs/steps.d.ts" />

import { equal, ok } from "assert";

Feature("Option").tag("html/option");

const html = () => /*html*/ `<select id="parent" aria-label="Parent">
  <option id="test" value="apple">Apple</option>
  <option id="second" value="banana">banana</option>
</select>`;

Scenario("Should be targetable", async ({ I }) => {
  I.setContent(html());
  ok(await I.grabAXNode("#test"));
}).tag("targetable");

Scenario("Should have role", async ({ I }) => {
  I.setContent(html());
  ok(
    ["menuitem", "MenuListOption", "combobox option"].includes(
      (await I.grabAXNode("#test"))?.role!
    )
  );
}).tag("role");

Scenario("Should have accessible name", async ({ I }) => {
  I.setContent(html());
  equal((await I.grabAXNode("#test"))?.name, "Apple");
}).tag("name");

Scenario("Should show selected", async ({ I }) => {
  I.setContent(html());
  equal((await I.grabAXNode("#test"))?.selected, true);
  equal((await I.grabAXNode("#second"))?.selected, undefined);
}).tag("selected");
