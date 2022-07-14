/// <reference path="../../../codeceptjs/steps.d.ts" />

import { expect } from "../../utils/expect";
import snapshot from "snap-shot-it";

Feature("Time").tag("aria/role/time");

const helpers = codeceptjs.config.get("helpers");
const html = /*html*/ `
  <button id="start" aria-label="start">start</button>
  <div id="test" role="time">Time</div>
`;

Scenario("Should support role", async ({ I }) => {
  I.setContent(html);
  
  if (helpers.ChromevoxHelper) {
    I.wait(2);
    I.focus("#start");
    I.nextItem();
  }

  expect(await I.grabATOutput("#test")).to.have.role("time");
}).tag("role");
