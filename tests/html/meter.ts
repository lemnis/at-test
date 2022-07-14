/// <reference path="../../codeceptjs/steps.d.ts" />

import { expect } from "../utils/expect";

Feature("Meter").tag("html/meter");

const helpers = codeceptjs.config.get("helpers");
const html = /*html*/ `<meter id="test2"></meter>`;
const htmlWithLabel = /*html*/ `<meter id="test"></meter><label for="test">Label</label>`;

Scenario.skip("Should be targetable when having a label", async ({ I }) => {
  I.setContent(/*html*/ `
    ${htmlWithLabel}
    <button>Seperator</button>
    ${html}
  `);

  if (helpers.ChromevoxHelper) {
    I.wait(2);
    I.nextItem();
    I.nextItem();
  }

  expect(await I.grabATOutput("#test")).to.exist;

  if (helpers.ChromevoxHelper) {
    I.nextItem();
    I.nextItem();
  }

  expect(await I.grabATOutput("#test2")).to.not.be.exist;
}).tag("targetable");

Scenario("Should have role", async ({ I }) => {
  I.setContent(htmlWithLabel);

  if (helpers.ChromevoxHelper) {
    I.wait(2);
    I.nextItem();
    I.nextItem();
  }

  expect(await I.grabATOutput("#test", true)).to.have.role("meter");
}).tag("role");

Scenario("Should have accessible name", async ({ I }) => {
  I.setContent(htmlWithLabel);

  if (helpers.ChromevoxHelper) {
    I.wait(2);
    I.nextItem();
    I.nextItem();
  }

  expect(await I.grabATOutput("#test", true)).to.have.name("Label");
}).tag("name");

Scenario.todo("Shoud convey low range").tag("value");
