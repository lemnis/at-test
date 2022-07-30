import { expect } from "../utils/expect";
import { ASSISTIVE_TECHNOLOGY, getAT } from "../utils/setup";

Feature("Option").tag("html/option");

const html = () => /*html*/ `<select id="parent" aria-label="Parent">
  <option id="test" value="apple" selected>apple</option>
  <option id="second" value="banana">banana</option>
</select>`;

Scenario("Should have role", async ({ I }) => {
  I.setContent(html());
  I.focus("#parent");
  I.clickNext();
  if ([ASSISTIVE_TECHNOLOGY.VOICEOVER].includes(getAT())) {
    await I.pressArrowDown();
    await I.pressArrowUp();
    await I.getDescription();
  }
  expect(await I.grabATOutput("#test", { checkCursor: false })).to.have.role([
    "menuitem",
    "MenuListOption",
    "combobox option",
    "menu item",
  ]);
  I.pressEscape();
}).tag("role");

Scenario("Should have accessible name", async ({ I }) => {
  I.setContent(html());
  I.focus("#parent");
  I.clickNext();
  if ([ASSISTIVE_TECHNOLOGY.VOICEOVER].includes(getAT())) {
    await I.pressArrowDown();
    await I.pressArrowUp();
  }

  expect(await I.grabATOutput("#test", { checkCursor: false })).to.have.name("apple");
  I.pressEscape();
}).tag("name");

Scenario("Should show selected", async ({ I }) => {
  I.setContent(html());
  I.click("#parent");
  if ([ASSISTIVE_TECHNOLOGY.VOICEOVER].includes(getAT())) {
    await I.pressArrowDown();
    await I.pressArrowUp();
  }

  const test = await I.grabATOutput("#test", { checkCursor: false });
  expect(test).to.have.name("apple");
  expect(test).to.be.selected();

  await I.pressArrowDown();
  const second = await I.grabATOutput("#second", { checkCursor: false });
  expect(second).to.have.name("banana");
  expect(second).to.not.be.selected();
  I.pressEscape();
}).tag("selected");

Scenario.todo('[size] / multiple test');