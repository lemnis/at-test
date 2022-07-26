/// <reference path="../../codeceptjs/steps.d.ts" />
import { expect } from "../utils/expect";

Feature("Option").tag("html/option");

const html = () => /*html*/ `<select id="parent" aria-label="Parent">
  <option id="test" value="apple" selected>apple</option>
  <option id="second" value="banana">banana</option>
</select>`;

Scenario("Should have role", async ({ I }) => {
  I.setContent(html());
  I.focus("#parent");
  I.clickNext();
  expect(await I.grabATOutput("#test")).to.have.role([
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

  await I.pressArrowDown();
  await I.pressArrowUp();
  expect(await I.grabATOutput("#test")).to.have.name("apple");
}).tag("name");

Scenario("Should show selected", async ({ I }) => {
  I.setContent(html());
  I.click("#parent");
  await I.pressArrowDown();
  await I.pressArrowUp();

  const test = await I.grabATOutput("#test");
  expect(test).to.have.name("apple");
  expect(test).to.be.selected();

  await I.pressArrowDown();
  const second = await I.grabATOutput("#second");
  expect(second).to.have.name("banana");
  expect(second).to.not.be.selected();
}).tag("selected");
