import { expect } from "../utils/expect";
import { ASSISTIVE_TECHNOLOGY, getAT, getDriver } from "../utils/setup";

Feature("Option").tag("html/option");

const html = () => /*html*/ `<select id="parent" aria-label="Parent">
  <option id="test" value="apple" selected>apple</option>
  <option id="second" value="banana">banana</option>
</select>`;

async function closeMenu(I: CodeceptJS.I) {
  ((I as any).pressVoKey || I.pressKey)("Escape");
  if (
    getDriver() === "WebDriver" &&
    (await I.grabATOutput("#test", { checkCursor: false }))?.output
      ?.textUnderCursor === "Turn Off All Automation button"
  ) {
    (I as any).pressVoKey("Tab", ["shift down"]);
    (I as any).pressVoKey("Tab", ["shift down"]);
    (I as any).pressVoKey("Space");
  }
}

Scenario("MUST convey its role", async ({ I }) => {
  I.setContent(html());
  I.focus("#parent");
  I.clickNext?.();
  if ([ASSISTIVE_TECHNOLOGY.VOICEOVER].includes(getAT())) {
    ((I as any).pressVoKey || I.pressKey)("ArrowDown");
    ((I as any).pressVoKey || I.pressKey)("ArrowUp");
    I.getDescription();
  }
  expect(await I.grabATOutput("#test", { checkCursor: false })).to.have.role([
    "menuitem",
    "MenuListOption",
    "combobox option",
    "menu item",
  ]);
  closeMenu(I);
}).tag("role");

Scenario("MUST convey its name", async ({ I }) => {
  I.setContent(html());
  I.focus("#parent");
  I.clickNext?.();
  if ([ASSISTIVE_TECHNOLOGY.VOICEOVER].includes(getAT())) {
    ((I as any).pressVoKey || I.pressKey)("ArrowDown");
    ((I as any).pressVoKey || I.pressKey)("ArrowUp");
  }

  expect(await I.grabATOutput("#test", { checkCursor: false })).to.have.name(
    "apple"
  );
  closeMenu(I);
}).tag("name");

Scenario("MUST convey the disabled state", async ({ I }) => {
  I.setContent(`<select id="parent" aria-label="Parent">
  <option id="test" value="apple" selected>apple</option>
  <option id="second" value="banana" disabled>banana</option>
</select>`);
  I.focus("#parent");
  I.clickNext?.();
  if ([ASSISTIVE_TECHNOLOGY.VOICEOVER].includes(getAT())) {
    ((I as any).pressVoKey || I.pressKey)("ArrowDown");
    ((I as any).pressVoKey || I.pressKey)("ArrowUp");
  }

  const test = await I.grabATOutput("#test", { checkCursor: false });
  expect(test).to.have.name("apple");
  expect(test).to.not.be.disabled;

  ((I as any).pressVoKey || I.pressKey)("ArrowDown");
  const second = await I.grabATOutput("#second", { checkCursor: false });
  expect(second).to.have.name("banana");
  expect(second).to.be.disabled;
  closeMenu(I);
}).tag("disabled");

Scenario("MUST convey the selected state", async ({ I }) => {
  I.setContent(html());
  I.focus("#parent");
  I.clickNext?.();
  if ([ASSISTIVE_TECHNOLOGY.VOICEOVER].includes(getAT())) {
    ((I as any).pressVoKey || I.pressKey)("ArrowDown");
    ((I as any).pressVoKey || I.pressKey)("ArrowUp");
  }

  const test = await I.grabATOutput("#test", { checkCursor: false });
  expect(test).to.have.name("apple");
  expect(test).to.be.selected;

  ((I as any).pressVoKey || I.pressKey)("ArrowDown");
  const second = await I.grabATOutput("#second", { checkCursor: false });
  expect(second).to.have.name("banana");
  expect(second).to.not.be.selected;
  closeMenu(I);
}).tag("selected");

Scenario.todo(
  "MAY convey information about the position the option in the list"
).tag("posInSet");

Scenario.todo("[size] / [multiple] test");
Scenario.todo("datalist test");
