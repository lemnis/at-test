/// <reference path="../../codeceptjs/steps.d.ts" />

import { equal, ok } from "assert";
const snapshot = require("snap-shot-it");

Feature("reportValidity()").tag("js/reportvalidity");

const html = /*html*/ `<form>
  <label>Email <input type="email" required value="foo"></label>
</form>`;

Scenario(
  "Should show validity & focus first invalid element",
  async ({ I }) => {
    I.setContent(html);
    I.executeScript(() => {
      document.querySelector("form")!.reportValidity();
    });

    const node = await I.grabAXNode(undefined, true);
    const input = await I.grabAXNode("input", true);
    snapshot(node as any);
    ok(input?.focused);
    ok(input?.invalid);
    equal(
      node?.children?.[0]?.name,
      "Please include an '@' in the email address. 'foo' is missing an '@'."
    );
  }
).tag("showAndFocus");

Feature("setCustomValidity()").tag("js/setCustomValidity");

const customValidityHtml = /*html*/ `<form>
  <label>Name <input type="text"></label>
  <label>Email <input type="email"></label>
</form>`;

Scenario(
  "Should show custom error & focus first invalid element",
  async ({ I }) => {
    I.setContent(customValidityHtml);
    I.executeScript(() => {
      document.querySelector("input")!.setCustomValidity("Custom Error");
      document.querySelector("form")!.reportValidity();
    });

    const node = await I.grabAXNode(undefined, true);
    const input = await I.grabAXNode("input[type=email]", true);
    snapshot(node as any);
    ok(input?.focused);
    ok(input?.invalid);
    equal(
      node?.children?.[0]?.name,
      "Custom Error"
    );
  }
).tag("showAndFocus");
