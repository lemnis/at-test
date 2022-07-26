/// <reference path="../../../codeceptjs/steps.d.ts" />

import { ok } from "assert";
import { expect } from "chai";
import snapshot from "snap-shot-it";

Feature("File").tag("html/input/file");

const helpers = codeceptjs.config.get("helpers");
const html = /*html*/ `<input id="test" type="file">`;
const htmlWithLabel = /*html*/ `<input id="test" type="file" /><label for="test">Label</label>`;

Scenario("Should be targetable", async function (this: any, { I }) {
  I.setContent(html);

  if (helpers.ChromevoxHelper || helpers.VoiceOver) {
    I.wait(2);
    I.focus("#test");
  }

  const ax = await I.grabATOutput("#test");
  snapshot(ax as any);
  ok(ax);
}).tag("targetable");

Scenario(
  "Name should reflect attached files",
  async function (this: any, { I }) {
    I.setContent(html);
    I.attachFile("#test", "data/image.svg");

    if (helpers.ChromevoxHelper || helpers.VoiceOver) {
      I.wait(2);
      I.focus("#test");
    }

    const ax = await I.grabATOutput("#test");
    snapshot(ax as any);
    const textAx = ax?.children?.[1] || ax;
    expect(textAx).to.have.name("image.svg");
  }
).tag("targetable");

Scenario("Should have role", async function (this: any, { I }) {
  I.setContent(html);

  if (helpers.ChromevoxHelper || helpers.VoiceOver) {
    I.wait(2);
    I.focus("#test");
  }

  const ax = await I.grabATOutput("#test");
  const buttonAx = ax?.children?.[0] || ax;
  expect(buttonAx).to.have.role("button");
}).tag("role");

Scenario(
  "Should have informative name",
  async function (this: any, { I }) {
    I.setContent(html);

    if (helpers.ChromevoxHelper || helpers.VoiceOver) {
      I.wait(2);
      I.focus("#test");
    }

    const ax = await I.grabATOutput("#test");
    const buttonAx = ax?.children?.[0] || ax;
    expect(buttonAx).to.have.name([
      "Choose File",
      "Browse…",
      "Choose file",
      "file upload button",
    ]);
  }
).tag("name");

Scenario(
  "Should indicate that no files are uploaded",
  async function (this: any, { I }) {
    I.setContent(html);

    if (helpers.ChromevoxHelper || helpers.VoiceOver) {
      I.wait(2);
      I.focus("#test");
    }

    const ax = await I.grabATOutput("#test");
    const textAx = ax?.children?.[1] || ax;
    expect(textAx).to.have.value([
      "no file selected",
      "No file chosen",
      "No file selected.",
    ]);
  }
).tag("noFiles");

Scenario("Should convey label", async function (this: any, { I }) {
  I.setContent(htmlWithLabel);

  if (helpers.ChromevoxHelper || helpers.VoiceOver) {
    I.wait(2);
    I.focus("#test");
  }

  const ax = await I.grabATOutput("#test");
  expect(ax).to.have.name("Label");
}).tag("nativeLabel");
