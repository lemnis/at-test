import snapshot from "snap-shot-it";
import { expect } from "../utils/expect";

xFeature("Meter").tag("html/meter");

const helpers = codeceptjs.config.get("helpers");
const html = 
  /*html*/ `<button id="start" aria-label="start">start</button><meter id="test2"></meter>`;
const htmlWithLabel = 
  /*html*/ `<button id="start" aria-label="start">start</button><meter id="test"></meter><label for="test">Label</label>`;

Scenario.skip("Should be targetable", async ({ I }) => {
  I.setContent(/*html*/ `
    ${html}
  `);

  if (helpers.ChromevoxHelper || helpers.VoiceOver) {
    I.focus("#start");
    I.nextItem?.();
  }

  expect(await I.grabATOutput("#test2")).to.exist;
  snapshot((await I.grabATOutput("#test2")) as any);
}).tag("targetable");

Scenario("Should have role", async ({ I }) => {
  I.setContent(htmlWithLabel);

  if (helpers.ChromevoxHelper || helpers.VoiceOver) {
    I.focus("#start");
    I.nextItem?.();
  }

  expect(await I.grabATOutput("#test", { includeIgnored: true })).to.have.role([
    "meter",
    "level indicator",
  ]);
}).tag("role");

Scenario("Should have accessible name", async ({ I }) => {
  I.setContent(htmlWithLabel);

  if (helpers.ChromevoxHelper || helpers.VoiceOver) {
    I.focus("#start");
    I.nextItem?.();
  }

  expect(await I.grabATOutput("#test", { includeIgnored: true })).to.have.name("Label");
}).tag("name");

Scenario.todo("Shoud convey low range").tag("value");
