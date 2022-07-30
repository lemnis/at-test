import { expect } from "../utils/expect";

Feature("Select").tag("html/select");

const helpers = codeceptjs.config.get("helpers");
const html = (label?: string) => /*html*/ `<select
  id="test"
  ${label ? `aria-label="${label}"` : ""}
>
  <option>apple</option>
</select>`;

Scenario("Should be focusable", async ({ I }) => {
  I.setContent(html());
  I.nextFocusableItem?.();
  expect(await I.grabFocusedElement()).to.have.property('role').with.oneOf([
    "combobox",
    "pop up button",
  ]);
}).tag("focusable");

Scenario("Should be expandable", async ({ I }) => {
  I.setContent(html());

  I.focus("#test");
  expect(await I.grabATOutput("#test")).to.be.collapsed;
  I.click("#test");
  expect(await I.grabATOutput("#test")).to.be.expanded;
  I.pressEscape();
}).tag("expandable");

Scenario("Should have value", async ({ I }) => {
  I.setContent(html());
  I.focus("#test");
  expect(await I.grabATOutput("#test")).to.have.value("apple");
}).tag("role");

Scenario("Should have role", async ({ I }) => {
  I.setContent(html());
  I.focus("#test");
  expect(await I.grabATOutput("#test")).to.have.role([
    "combobox",
    "pop up button",
  ]);
}).tag("role");

Scenario("Should have accessible name", async ({ I }) => {
  I.setContent(html("Select label"));
  I.focus("#test");
  expect(await I.grabATOutput("#test")).to.have.name("Select label");
}).tag("name");
