/// <reference path="../../codeceptjs/steps.d.ts" />

import { equal, ok } from "assert";
import snapshot from "snap-shot-it";
import { expect } from "../utils/expect";

Feature("Textarea").tag("html/textarea");

const helpers = codeceptjs.config.get("helpers");
const html = /*html*/ `<textarea id="test"></textarea>`;

const VoiceOverMacOsActions = [
  'nextItem',
  'nextFocusableItem',
  'nextFormControl',
  'rotor({ menu: "Form Controls" })',
];

Scenario("Should be targetable", async ({ I }) => {
  I.setContent(html);

  if (helpers.ChromevoxHelper || helpers.VoiceOver) {
    I.wait(2);
  }
  
  const ax = await I.grabATOutput("#test");
  ok(ax);
  snapshot(ax);
}).tag("targetable");

Scenario("Should be focusable", async ({ I }) => {
  I.setContent(html);
  I.pressKey("Tab");
  ok((await I.grabATOutput("#test"))?.focused);
}).tag("focusable");

Scenario("Should have role", async ({ I }) => {
  I.setContent(html);

  if (helpers.ChromevoxHelper || helpers.VoiceOver) {
    I.wait(2);
  }

  if (helpers.ChromevoxHelper) {
    I.nextItem();
    I.nextItem();
  }

  expect(await I.grabATOutput("#test")).to.have.role([
    "textbox",
    "text area",
    "edit text",
  ]);
}).tag("role");

Scenario("Should be multiline", async ({ I }) => {
  I.setContent(html);

  if (helpers.ChromevoxHelper || helpers.VoiceOver) {
    I.wait(2);
  }

  expect(await I.grabATOutput("#test")).to.be.multiline();
}).tag("multiline");
