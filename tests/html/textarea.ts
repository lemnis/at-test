import snapshot from "snap-shot-it";
import { expect } from "../utils/expect";

Feature("Textarea").tag("html/textarea");

const helpers = codeceptjs.config.get("helpers");
const html = /*html*/ `<button id="start" type="button">start</button><textarea id="test"></textarea>`;

const VoiceOverMacOsActions = [
  "nextItem",
  "nextFocusableItem",
  "nextFormControl",
  'rotor({ menu: "Form Controls" })',
];

Scenario("Should be focusable", async ({ I }) => {
  I.setContent(html);
  I.focus("#start");
  I.nextFocusableItem();
  expect(await I.grabFocusedElement()).to.have.property("focused", true);
}).tag("focusable");

Scenario("Should have role", async ({ I }) => {
  I.setContent(html);

  if (helpers.ChromevoxHelper || helpers.VoiceOver) {
    I.focus("#start");
    I.nextItem?.();
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
    I.focus("#start");
    I.nextItem?.();
  }

  expect(await I.grabATOutput("#test")).to.be.multiline();
}).tag("multiline");
