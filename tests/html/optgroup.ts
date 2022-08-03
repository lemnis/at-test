import { expect } from "chai";
import { ASSISTIVE_TECHNOLOGY, getAT } from "../utils/setup";

xFeature("Optgroup").tag("html/optgroup");

const html = () => /*html*/ `<select id="parent">
  <optgroup label="Fruits" id="test">
    <option value="apple">apple</option>
    <option value="banana">banana</option>
  </optgroup>
</select>`;

Scenario("MUST convey its role", async ({ I }) => {
  I.setContent(html());
  I.click("#parent");
  if ([ASSISTIVE_TECHNOLOGY.VOICEOVER].includes(getAT())) {
    await I.pressKey('ArrowDown');
    await I.pressKey('ArrowUp');
  }
  expect(
    await I.grabATOutput("#test", { includeIgnored: true, checkCursor: false })
  ).to.have.role("group");
  I.pressKey("Escape");
}).tag("role");

Scenario("MUST convey its name", async ({ I }) => {
  I.setContent(html());
  I.click("#parent");
  if ([ASSISTIVE_TECHNOLOGY.VOICEOVER].includes(getAT())) {
    await I.pressKey('ArrowDown');
    await I.pressKey('ArrowUp');
  }
  expect(
    await I.grabATOutput("#test", { includeIgnored: true, checkCursor: false })
  ).to.have.name("Fruits");
  I.pressKey("Escape");
}).tag("name");
