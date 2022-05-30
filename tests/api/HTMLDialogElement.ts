/// <reference path="../../codeceptjs/steps.d.ts" />

import { equal, ok } from "assert";
const snapshot = require("snap-shot-it");

Feature("HTMLDialogElement").tag("api/HTMLDialogElement");

const html = /*html*/ `<dialog>
  <button>Button inside modal</button>
</dialog><button>Button outside modal</button>`;

Scenario("When closed it and his children should be ignored", async ({ I }) => {
  I.setContent(html);
  let root = await I.grabAXNode(undefined);
  equal(root?.children?.length, 1);
  equal(root?.children?.[0]?.name, "Button outside modal");
  snapshot(root);
}).tag("closed");

Scenario(
  "When opened as modal only his children should be visiblein the accessibility tree",
  async ({ I }) => {
    I.setContent(html);
    I.executeScript(() => {
      (document.querySelector("dialog") as any)!.showModal();
    });

    const root = await I.grabAXNode(undefined);
    equal(root?.children?.length, 1);
    equal(root?.children?.[0]?.name, "Button inside modal");
    equal(root?.children?.[0]?.focused, true);
    snapshot(root);
  }
).tag("showAndFocus");

Scenario(
  "When opened normally the accessibility tree should include all elements",
  async ({ I }) => {
    I.setContent(html);
    I.executeScript(() => {
      (document.querySelector("dialog") as any)!.show();
    });

    const root = await I.grabAXNode(undefined);
    equal(root?.children?.length, 2);
    equal(root?.children?.[0]?.name, "Button inside modal");
    equal(root?.children?.[0]?.focused, true);
    equal(root?.children?.[1]?.name, "Button outside modal");
    snapshot(root);
  }
).tag("showAndFocus");

Scenario(
  "Pressing Escape should hide the modal",
  async ({ I }) => {
    I.setContent(html);
    I.executeScript(() => {
      (document.querySelector("dialog") as any)!.showModal();
    });

    let root = await I.grabAXNode(undefined);
    equal(root?.children?.length, 1);
    equal(root?.children?.[0]?.name, "Button inside modal");
    equal(root?.children?.[0]?.focused, true);

    I.pressKey('Escape');

    root = await I.grabAXNode(undefined);
    equal(root?.children?.length, 1);

    equal(root?.children?.[0]?.name, "Button outside modal");
    snapshot(root);
  }
).tag("pressEscape");
