/// <reference path="../../../codeceptjs/steps.d.ts" />

import { ok } from "assert";
import snapshot from "snap-shot-it";

Feature("File").tag("html/input/file");

const html = /*html*/ `<input id="test" type="file">`;
const htmlWithLabel = /*html*/ `<input id="test" type="file" /><label for="test">Label</label>`;

Scenario("Should be targetable", async function (this: any, { I }) {
  I.setContent(html);
  const ax = await I.grabAXNode("#test");
  snapshot(ax as any);
  ok(ax);
}).tag("targetable");

Scenario(
  "Name should reflect attached files",
  async function (this: any, { I }) {
    I.setContent(html);
    I.attachFile("#test", "data/image.svg");
    const ax = await I.grabAXNode("#test");
    snapshot(ax as any);
    const textAx = ax?.children?.[1] || ax;
    ok(textAx?.name, "image.svg");
  }
).tag("targetable");

Scenario(
  "Should have upload button with informative name",
  async function (this: any, { I }) {
    I.setContent(html);
    const ax = await I.grabAXNode("#test");
    const buttonAx = ax?.children?.[0] || ax;
    ok(buttonAx?.role, "button");
    ok(
      ["Choose File", "Browse…", "Choose file"].includes(buttonAx?.name as any)
    );
  }
).tag("role");

Scenario(
  "Should indicate that no files are uploaded",
  async function (this: any, { I }) {
    I.setContent(html);
    const ax = await I.grabAXNode("#test");
    const textAx = ax?.children?.[1] || ax;
    ok(
      ["no file selected", "No file chosen", "No file selected."].includes(
        textAx?.value as any
      )
    );
  }
).tag("name");

Scenario("Should convey label", async function (this: any, { I }) {
  I.setContent(htmlWithLabel);
  const ax = await I.grabAXNode("#test");
  ok(ax?.name, "Label");
}).tag("name");
