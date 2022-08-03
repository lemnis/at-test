import snapshot from "snap-shot-it";
import { expect } from "../utils/expect";
import { getAT, ASSISTIVE_TECHNOLOGY } from "../utils/setup";
import { TAGS } from "../utils/tags";

Feature("Ol").tag("html/ol");

const html = `
  <button id="start">start</button>
  <ol id="test">
    <li>
      Cats
      <ol>
        <li>Big cat</li>
        <li>Small cat</li>
      </ol>
    </li>
    <li>Dogs</li>
    <li>Birds</li>
  </ol>`;

  Scenario("MUST convey its role", async ({ I }) => {
    I.setContent(html);
    I.focus("#start");
    I.nextItem?.();
  
    const ax = await I.grabATOutput("#test", { includeIgnored: true });
    expect(ax).to.have.role(["list", "List with"]);
    snapshot(ax as any);
  }).tag(TAGS.ROLE);
  
  Scenario("MUST convey the list boundaries - start", async function (this: any, { I }) {
    if (getAT() === ASSISTIVE_TECHNOLOGY.NONE) this.skip();
  
    I.setContent(html);
    I.focus("#start");
    I.nextItem?.();
  
    const ax = await I.grabATOutput("#test", { includeIgnored: true });
    expect(ax).to.have.name(["list", "List with"]);
    snapshot(ax as any);
  }).tag(TAGS.BOUNDARIES);
  
  Scenario("MUST convey the list boundaries - end", async function (this: any, { I }) {
    if (getAT() === ASSISTIVE_TECHNOLOGY.NONE) this.skip();
  
    I.setContent(html);
    I.focus("#start");
  
    // Enter outer ul
    if (getAT() === ASSISTIVE_TECHNOLOGY.VOICEOVER) I.nextItem?.();
  
    I.nextItem?.();
  
    // Enter innel ul
    if (getAT() === ASSISTIVE_TECHNOLOGY.VOICEOVER) I.nextItem?.();
  
    I.nextItem?.();
    I.nextItem?.();
  
    // Exit inner ul
    if (getAT() === ASSISTIVE_TECHNOLOGY.VOICEOVER) I.nextItem?.();
  
    I.nextItem?.();
    I.nextItem?.();
  
    // Exit outer ul
    I.nextItem?.();
  
    const ax = await I.grabATOutput("#test", { includeIgnored: true });
    expect(ax).to.have.name(["end of list"]);
    snapshot(ax as any);
  }).tag(TAGS.BOUNDARIES);
  
  Scenario("MUST convey the number of items in the list", async function (this: any, { I }) {
    if (getAT() === ASSISTIVE_TECHNOLOGY.NONE) this.skip();
  
    I.setContent(html);
    I.focus("#start");
    I.nextItem?.();
  
    const ax = await I.grabATOutput("#test", { includeIgnored: true });
    expect(ax).to.have.name(['3 items']);
  }).tag(TAGS.SIZE);

Scenario("SHOULD convey the nesting level", async function (this: any, { I }) {
  if (getAT() === ASSISTIVE_TECHNOLOGY.NONE) this.skip();

  I.setContent(html);
  I.focus("#start");
  if (getAT() === ASSISTIVE_TECHNOLOGY.VOICEOVER) I.nextItem?.();
  I.nextItem?.();
  I.nextItem?.();

  const ax = await I.grabATOutput("ul ul", { includeIgnored: true, checkCursor: false });
  expect(ax).to.have.level(2);
  snapshot(ax as any);
}).tag(TAGS.LEVEL);
  