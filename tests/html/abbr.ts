/// <reference path="../../codeceptjs/steps.d.ts" />
import { expect } from "chai";
import snapshot from "snap-shot-it";

Feature("Abbr").tag("html/abbr");

const helpers = codeceptjs.config.get("helpers");
const html = /*html*/ `
  <button id="start" aria-label="start">start</button>
  <abbr id="test" title="Cascading Style Sheets">CSS</abbr>
`;

Scenario.skip("Should be targetable", async ({ I }) => {
  I.setContent(html);

  if (helpers.ChromevoxHelper || helpers.VoiceOver) {
    I.wait(2);
    I.focus("#start");
    I.nextItem();
  }

  const ax = await I.grabATOutput("#test");
  expect(ax).to.not.empty;
}).tag("targetable");

Scenario.skip("Should be full name", async ({ I }) => {
  I.setContent(html);

  if (helpers.ChromevoxHelper || helpers.VoiceOver) {
    I.wait(2);
    I.focus("#start");
    I.nextItem();
  }

  const ax = await I.grabATOutput();
  snapshot(ax as any);
  snapshot((await I.grabATOutput(undefined, true)) as any);
  expect(await I.grabATOutput("#test")).to.have.name("Cascading Style Sheets");
}).tag("name");

Scenario("Should have role", async function (this: any, { I }) {
  if (helpers.VoiceOver) {
    this.skip();
  }

  I.setContent(html);

  if (helpers.ChromevoxHelper || helpers.VoiceOver) {
    I.wait(2);
    I.focus("#start");
    I.nextItem();
  }

  expect(await I.grabATOutput("#test")).to.have.role([
    "Abbr",
    "text",
    "Inline",
  ]);
}).tag("role");
