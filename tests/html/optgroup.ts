import { expect } from "chai";
import { ASSISTIVE_TECHNOLOGY, getAT } from "../utils/setup";

Feature("Optgroup").tag("html/optgroup");

const html = () => /*html*/ `<select id="parent">
  <optgroup label="Fruits" id="test">
    <option value="apple">apple</option>
    <option value="banana">banana</option>
  </optgroup>
</select>`;

Scenario("Should have role", async ({ I }) => {
  I.setContent(html());
  I.click("#parent");
  if ([ASSISTIVE_TECHNOLOGY.VOICEOVER].includes(getAT())) {
    await I.pressArrowDown();
    await I.pressArrowUp();
  }
  expect(
    await I.grabATOutput("#test", { includeIgnored: true, checkCursor: false })
  ).to.have.role("group");
  I.pressEscape();
}).tag("role");

Scenario("Should have accessible name", async ({ I }) => {
  I.setContent(html());
  I.click("#parent");
  if ([ASSISTIVE_TECHNOLOGY.VOICEOVER].includes(getAT())) {
    await I.pressArrowDown();
    await I.pressArrowUp();
  }
  expect(
    await I.grabATOutput("#test", { includeIgnored: true, checkCursor: false })
  ).to.have.name("Fruits");
  I.pressEscape();
}).tag("name");
