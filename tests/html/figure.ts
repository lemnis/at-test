/// <reference path="../../codeceptjs/steps.d.ts" />

import { equal, ok } from "assert";
import { expect } from "../utils/expect";
import snapshot from "snap-shot-it";

Feature("Figure").tag("html/figure");

const helpers = codeceptjs.config.get("helpers");
const html = /*html*/ `
<button id="start" aria-label="start">start</button>
<figure id="test">
  <img src="https://placekitten.com/100/100" alt="Kitten">
  <figcaption>Some caption about the kitten</figcaption>
</figure>`;

const htmlMissingCaption = /*html*/ `
<button id="start" aria-label="start">start</button>
<figure id="test" tabindex="0">
  <img src="https://placekitten.com/100/100" alt="Kitten">
</figure>`;

Scenario("Should be targetable", async ({ I }) => {
  I.setContent(html);

  if (helpers.ChromevoxHelper || helpers.VoiceOverHelper) {
    I.wait(1);
    I.focus("#start");
    I.nextItem();
  }

  const ax = await I.grabATOutput("#test", true);
  snapshot(ax as any);
  ok(ax);
}).tag("targetable");

Scenario("Should have role", async ({ I }) => {
  I.setContent(html);

  if (helpers.ChromevoxHelper || helpers.VoiceOverHelper) {
    I.wait(1);
    I.focus("#start");
    I.nextItem();
  }

  const ax = await I.grabATOutput("#test", true);
  equal(ax?.role, "figure");
}).tag("role");

Scenario("Should have name", async ({ I }) => {
  I.setContent(html);

  if (helpers.ChromevoxHelper || helpers.VoiceOverHelper) {
    I.wait(1);
    I.focus("#start");
    I.nextItem();
  }

  expect(await I.grabATOutput("#test", true)).to.have.name(
    "Some caption about the kitten"
  );
}).tag("name");

Scenario.skip("Should have empty name when missing caption", async ({ I }) => {
  I.setContent(htmlMissingCaption);

  if (helpers.ChromevoxHelper || helpers.VoiceOverHelper) {
    I.wait(2);
    I.focus("#start");
    I.nextItem();
  }

  const ax = await I.grabATOutput("#test", true);
  snapshot(ax as any);
  expect(ax).to.have.name("");
}).tag("nameMissingFigcaption");
