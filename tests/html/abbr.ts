import { expect } from "../utils/expect";
import snapshot from "snap-shot-it";

xFeature("Abbr").tag("html/abbr");

const helpers = codeceptjs.config.get("helpers");
const html = /*html*/ `
  <button id="start" aria-label="start">start</button>
  <abbr id="test" title="Cascading Style Sheets">CSS</abbr>
`;

Scenario.skip("Should be full name", async ({ I }) => {
  I.setContent(html);

  if (helpers.Chromevox || helpers.VoiceOver) {
    I.focus("#start");
    I.nextItem?.();
  }

  const ax = await I.grabATOutput();
  snapshot(ax as any);
  snapshot((await I.grabATOutput(undefined, { includeIgnored: true })) as any);
  expect(await I.grabATOutput("#test")).to.have.name("Cascading Style Sheets");
}).tag("name");

Scenario("Should have role", async function (this: any, { I }) {
  // if (helpers.VoiceOver) {
  //   this.skip();
  // }

  I.setContent(html);

  if (helpers.Chromevox || helpers.VoiceOver) {
    I.focus("#start");
    I.nextItem?.();
  }

  expect(await I.grabATOutput("#test")).to.have.role([
    "Abbr",
    "text",
    "Inline",
  ]);
}).tag("role");
