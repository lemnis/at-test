/// <reference path="../../codeceptjs/steps.d.ts" />

import { equal, ok } from "assert";
import snapshot from "snap-shot-it";
import { expect } from "../utils/expect";

Feature("Summary").tag("html/summary");

const helpers = codeceptjs.config.get("helpers");

const html = /*html*/ `
  <button id="start" aria-label="start">start</button>
  <details>
    <summary id="test">Title</summary>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi ipsum
    reprehenderit dolore quo autem ad eaque officia non quisquam vel.
  </details>
`;

Scenario("Should be targetable", async ({ I }) => {
  I.setContent(html);

  if (helpers.ChromevoxHelper || helpers.VoiceOverHelper) {
    I.wait(2);
    I.focus("#start");
    I.nextItem();
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

Scenario("Should be expandable", async ({ I }) => {
  I.setContent(html);
  
  if (helpers.ChromevoxHelper || helpers.VoiceOverHelper) {
    I.wait(2);
    I.focus("#start");
    I.nextItem();
  }

  expect(await I.grabATOutput("#test")).to.be.collapsed();

  I.click("#test");
  
  expect(await I.grabATOutput("#test")).to.be.expanded();
}).tag("expandable");

Scenario("Should have role", async ({ I }) => {
  I.setContent(html);

  if (helpers.ChromevoxHelper || helpers.VoiceOverHelper) {
    I.wait(2);
    I.focus("#start");
    I.nextItem();
  }

  expect(await I.grabATOutput("#test")).to.have.role([
    "Summary",
    "summary",
    "DisclosureTriangle",
  ]);
}).tag("role");

Scenario("Should have accessible name", async ({ I }) => {
  I.setContent(html);

  if (helpers.ChromevoxHelper || helpers.VoiceOverHelper) {
    I.wait(2);
    I.focus("#start");
    I.nextItem();
  }

  expect(await I.grabATOutput("#test")).to.have.name("Title");
}).tag("name");
