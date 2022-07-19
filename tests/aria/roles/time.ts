/// <reference path="../../../codeceptjs/steps.d.ts" />

import { expect } from "../../utils/expect";
import snapshot from "snap-shot-it";

Feature("Time").tag("aria/role/time");

const helpers = codeceptjs.config.get("helpers");
const html = /*html*/ `
  <button id="start" aria-label="start">start</button>
  <div id="test" role="time">Today</div>
`;

Scenario("Should support role", async ({ I }) => {
  I.setContent(html);

  if (helpers.ChromevoxHelper || helpers.VoiceOverHelper) {
    I.wait(2);
    I.focus("#start");
    I.nextItem();
  }

  const ax = await I.grabATOutput("#test");
  snapshot(ax as any);
  expect(ax).to.have.role("time");
}).tag("role");
