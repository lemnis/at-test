/// <reference path="../../codeceptjs/steps.d.ts" />

import { equal, ok } from "assert";
import snapshot from "snap-shot-it";

Feature("Figure").tag("html/figure");

const html = /*html*/ `<figure id="test">
  <img src="https://placekitten.com/100/100" alt="Kitten">
  <p>Non-image figure content</p>
  <figcaption>Some caption about the kitten</figcaption>
</figure>`;

const htmlMissingCaption = /*html*/ `<figure id="test">
  <img src="https://placekitten.com/100/100" alt="Kitten">
  <p>Non-image figure content</p>
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
  equal(ax?.role, 'figure');
}).tag("role");

Scenario("Should have name", async ({ I }) => {
  I.setContent(html);
  const ax = await I.grabAXNode("#test", true);
  equal(ax?.name, 'Some caption about the kitten');
}).tag("name");

Scenario("Should have empty name when missing caption", async ({ I }) => {
  I.setContent(htmlMissingCaption);
  const ax = await I.grabAXNode("#test", true);
  snapshot(ax as any);
  equal(ax?.name, '');
}).tag("nameMissingFigcaption");