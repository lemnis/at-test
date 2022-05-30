/// <reference path="../../codeceptjs/steps.d.ts" />

import { equal, ok } from "assert";

Feature("Optgroup").tag("html/optgroup");

const html = () => /*html*/ `<select>
  <optgroup label="Fruits" id="test">
      <option value="apple">apple</option>
      <option value="banana">banana</option>
  </optgroup>
</select>`;

Scenario("Should be targetable", async ({ I }) => {
  I.setContent(html());
  ok(await I.grabAXNode("#test", true));
}).tag("targetable");

Scenario("Should have role", async ({ I }) => {
  I.setContent(html());
  equal((await I.grabAXNode("#test", true))?.role, "group");
}).tag("role");

Scenario("Should have accessible name", async ({ I }) => {
  I.setContent(html());
  equal((await I.grabAXNode("#test", true))?.name, "Fruits");
}).tag("name");
