import { expect } from "chai";
import snapshot from "snap-shot-it";
import { ASSISTIVE_TECHNOLOGY, getAT } from "../utils/setup";

Feature("Progress").tag("html/progress");

const html = () => /*html*/ `
  <button id="start" type="button">start</button>
  <progress id="test"></progress>
  <button id="end" type="button">end</button>
`;
const htmlWithLabel = () => /*html*/ `
  <button id="start" type="button">start</button>
  <progress id="test"></progress>
  <label for="test">Label</label>
  <button id="end" type="button">end</button>
`;

Scenario("Should be targetable when having a label", async ({ I }) => {
  I.setContent(htmlWithLabel());

  if ([ASSISTIVE_TECHNOLOGY.VOICEOVER].includes(getAT())) {
    I.focus("#start");
    I.nextItem?.();
  }

  snapshot((await I.grabATOutput("#test")) as any);
  expect(await I.grabATOutput("#test")).to.not.be.undefined;

  I.setContent(html());
  
  if ([ASSISTIVE_TECHNOLOGY.VOICEOVER].includes(getAT())) {
    I.focus("#start");
    I.nextItem?.();
  }

  snapshot((await I.grabATOutput("#test")) as any);
  expect(await I.grabATOutput("#test")).to.be.undefined;
}).tag("targetable");

Scenario("Should have role", async ({ I }) => {
  I.setContent(htmlWithLabel());

  if ([ASSISTIVE_TECHNOLOGY.VOICEOVER].includes(getAT())) {
    I.focus("#start");
    I.nextItem?.();
  }

  expect(await I.grabATOutput("#test")).to.have.role([
    "progressbar",
    "progress indicator",
  ]);
}).tag("role");

Scenario("Should have accessible name", async ({ I }) => {
  I.setContent(htmlWithLabel());

  if ([ASSISTIVE_TECHNOLOGY.VOICEOVER].includes(getAT())) {
    I.focus("#start");
    I.nextItem?.();
  }

  expect(await I.grabATOutput("#test")).to.have.name("Label");
}).tag("name");

Scenario.todo("Shoud convey current value").tag("value");
Scenario.todo("Shoud convey indeterminate state").tag("indeterminate");
