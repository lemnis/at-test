/// <reference path="../../codeceptjs/steps.d.ts" />

import { equal, ok } from "assert";
import snapshot from "snap-shot-it";

Feature("Figcaption").tag("html/figcaption");

const html = /*html*/ `<figure>
  <img src="https://placekitten.com/100/100" alt="Kitten">
  <p>Non-image figure content</p>
  <figcaption id="test">Some caption about the kitten</figcaption>
</figure>`;

Scenario("Should be targetable", async ({ I }) => {
  I.setContent(html);
  const ax = await I.grabAXNode("#test", true);
  snapshot(ax as any);
  ok(ax);
}).tag("targetable");

Scenario("Should have role", async ({ I }) => {
  I.setContent(html);
  const ax = await I.grabAXNode("#test", true);
  ok(['caption', 'Figcaption'].includes(ax?.role!))
}).tag("role");

Scenario("Should have name", async ({ I }) => {
  I.setContent(html);
  const ax = await I.grabAXNode("#test", true);
  equal(ax?.children?.[0]?.name, 'Some caption about the kitten');
}).tag("name");
