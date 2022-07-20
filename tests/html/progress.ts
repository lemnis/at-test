/// <reference path="../../codeceptjs/steps.d.ts" />
import { expect } from "chai";
import snapshot from "snap-shot-it";

Feature("Progress").tag("html/progress");

const html = () => /*html*/ `<progress id="test"></progress>`;
const htmlWithLabel = () =>
  /*html*/ `<progress id="test"></progress><label for="test">Label</label>`;

Scenario("Should be targetable when having a label", async ({ I }) => {
  I.setContent(htmlWithLabel());
  snapshot(await I.grabATOutput("#test") as any);
  expect(await I.grabATOutput("#test")).to.not.be.undefined;

  I.setContent(html());
  snapshot(await I.grabATOutput("#test") as any);
  expect(await I.grabATOutput("#test")).to.be.undefined;
}).tag("targetable");

Scenario("Should have role", async ({ I }) => {
  I.setContent(htmlWithLabel());
  expect(await I.grabATOutput("#test")).to.have.role("progressbar");
}).tag("role");

Scenario("Should have accessible name", async ({ I }) => {
  I.setContent(htmlWithLabel());
  expect(await I.grabATOutput("#test")).to.have.name("Label");
}).tag("name");

Scenario.todo("Shoud convey current value").tag("value");
Scenario.todo("Shoud convey indeterminate state").tag("indeterminate");
