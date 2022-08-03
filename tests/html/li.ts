import snapshot from "snap-shot-it";
import { expect } from "../utils/expect";
import { ASSISTIVE_TECHNOLOGY, getAT } from "../utils/setup";
import { TAGS } from "../utils/tags";

Feature("Li").tag("html/li");

const html = (parentTag = 'ol') => `
  <button id="start">start</button>
  <${parentTag}>
    <li id="test">Cats</li>
    <li>Dogs</li>
    <li>Birds</li>
  </${parentTag}>`;

Scenario("MUST convey its role in ordered list", async ({ I }) => {
  I.setContent(html());
  await I.focus("#start");
  if(getAT() !== ASSISTIVE_TECHNOLOGY.CHROMEVOX) await I.nextItem?.();
  await I.nextItem?.();

  const ax = await I.grabATOutput("#test", { includeIgnored: true, checkCursor: false });
  expect(ax).to.have.role(["1", "listitem", "List item"]);
  snapshot(ax as any);
}).tag(TAGS.ROLE);

Scenario("MUST convey its role in unordered list", async ({ I }) => {
  I.setContent(html('ul'));
  await I.focus("#start");
  if(getAT() !== ASSISTIVE_TECHNOLOGY.CHROMEVOX) await I.nextItem?.();
  await I.nextItem?.();

  const ax = await I.grabATOutput("#test", { includeIgnored: true, checkCursor: false });
  expect(ax).to.have.role(["•", "listitem", "List item"]);
  snapshot(ax as any);
}).tag(TAGS.ROLE);

Scenario("MUST convey its position within an ordered list", async function (this: any, { I }) {
  if(getAT() === ASSISTIVE_TECHNOLOGY.NONE) this.skip();

  I.setContent(html('ol'));
  await I.focus("#start");
  if(getAT() !== ASSISTIVE_TECHNOLOGY.CHROMEVOX) await I.nextItem?.();
  await I.nextItem?.();

  const ax = await I.grabATOutput("#test", { includeIgnored: true, checkCursor: false });
  expect(ax).to.have.position(1);
  snapshot(ax as any);
}).tag(TAGS.POSITION);

Scenario("SHOULD NOT convey its position within an unordered list", async function (this: any, { I }) {
  if(getAT() === ASSISTIVE_TECHNOLOGY.NONE) this.skip();

  I.setContent(html('ul'));
  await I.focus("#start");
  if(getAT() !== ASSISTIVE_TECHNOLOGY.CHROMEVOX) await I.nextItem?.();
  await I.nextItem?.();

  const ax = await I.grabATOutput("#test", { includeIgnored: true, checkCursor: false });
  expect(ax).to.not.have.position(1);
  snapshot(ax as any);
}).tag(TAGS.NOT_POSITION);
