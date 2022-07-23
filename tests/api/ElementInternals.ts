/// <reference path="../../codeceptjs/steps.d.ts" />

import { expect } from "../utils/expect";
const snapshot = require("snap-shot-it");

Feature("reportValidity()").tag("js/reportvalidity");

const helpers = codeceptjs.config.get("helpers");
const html = /*html*/ `<form>
  <label>Email <input type="email" required value="foo"></label>
</form>`;

Scenario(
  "Should show validity & focus first invalid element",
  async ({ I }) => {
    I.setContent(html);

    if (helpers.ChromevoxHelper || helpers.VoiceOverHelper) {
      I.wait(1);
      I.focus('input');
    }

    const input = await I.grabATOutput("input", true);
    expect(input).to.be.invalid;
    // ok(input?.focused);

    if (helpers.ChromevoxHelper || helpers.VoiceOverHelper) {
      I.wait(4);
    }

    I.executeScript(() => {
      document.querySelector("form")!.reportValidity();
    });

    const node = await I.grabATOutput(undefined, true);
    // snapshot(node as any);
    expect(node?.children?.[0] || node).to.have.name([
      "Please include an '@' in the email address. 'foo' is missing an '@'.",
      "Enter an email address",
    ]);
  }
).tag("showAndFocus");

Feature("setCustomValidity()").tag("js/setCustomValidity");

const customValidityHtml = /*html*/ `<form>
  <label>Name <input type="text"></label>
  <label>Email <input type="email"></label>
</form><style>input:invalid { border: 2px solid red }</style>`;

Scenario(
  "Should show custom error & focus first invalid element",
  async ({ I }) => {
    I.setContent(customValidityHtml);
    I.executeScript(() => {
      document.querySelector("input")!.setCustomValidity("Custom Error");
    });

    if (helpers.ChromevoxHelper || helpers.VoiceOverHelper) {
      I.wait(1);
      I.focus('input');
    }


    const input = await I.grabATOutput("input", true);
    expect(input).to.be.invalid;
    // ok(input?.focused);
    
    I.executeScript(() => {
      document.querySelector("form")!.reportValidity();
    });

    const node = await I.grabATOutput(undefined, true);
    // snapshot(node as any);
    expect(node?.children?.[0] || node).to.have.name("Custom Error");
  }
).tag("showAndFocus");
