import snapshot from "snap-shot-it";
import { expect } from "../utils/expect";
import { getAT, ASSISTIVE_TECHNOLOGY } from "../utils/setup";

xFeature("Textarea").tag("html/textarea");

const html = /*html*/ `<button id="start" type="button">start</button><textarea id="test">Buffalo</textarea>`;
const htmlWithLabel = /*html*/ `<button id="start" type="button">start</button><textarea aria-label="Foo" id="test"></textarea>`;

const VoiceOverMacOsActions = [
  "nextItem",
  "nextFocusableItem",
  "nextControlItem",
];

const navigation =
  getAT() === ASSISTIVE_TECHNOLOGY.VOICEOVER
    ? VoiceOverMacOsActions
    : ["nextItem"];

Scenario("MUST convey its name", async ({ I }) => {
  I.setContent(htmlWithLabel);
  I.focus("#start");
  I.nextFocusableItem();
  expect(await I.grabFocusedElement()).to.have.name("Foo");
}).tag("name");

Scenario("MUST convey its role", async ({ I }) => {
  I.setContent(html);
  I.focus("#start");
  I.nextItem?.();
  expect(await I.grabATOutput("#test")).to.have.role([
    "textbox",
    "text area",
    "edit text",
  ]);
}).tag("role");

Scenario("MUST convey the current value", async ({ I }) => {
  I.setContent(html);
  I.focus("#start");
  I.nextItem?.();
  expect(await I.grabATOutput("#test")).to.have.value("Buffalo");
}).tag("value");

Scenario("MUST convey changes in value	", async ({ I }) => {
  I.setContent(html);
  I.focus("#start");
  I.nextFocusableItem();
  I.type('Hello ');
  I.previousFocusableItem();
  I.nextFocusableItem();
  expect(await I.grabATOutput("#test")).to.have.value("Hello Buffalo");
}).tag("valueChange");

navigation.forEach((nav) => {
  Scenario(
    `SHOULD provide shortcuts to jump to this role - ${nav}`,
    async ({ I }) => {
      I.setContent(htmlWithLabel);
      I.focus("#start");
      I[nav]?.();
      expect(await I.grabATOutput("#test")).to.have.name("Foo");
    }
  ).tag("shortcuts");
});

if (getAT() === ASSISTIVE_TECHNOLOGY.VOICEOVER) {
  Scenario(
    `SHOULD provide shortcuts to jump to this role - rotor`,
    async function (this: any, { I }) {
      I.setContent(htmlWithLabel);
      I.focus("#start");
      (I as any).rotor({
        menu: "Form Controls",
        find: "Foo",
      });
      expect(await I.grabATOutput("#test")).to.have.name("Foo");
    }
  ).tag("shortcuts");
}

Scenario("SHOULD convey its multiline state", async ({ I }) => {
  I.setContent(html);
  I.focus("#start");
  I.nextItem?.();
  expect(await I.grabATOutput("#test")).to.be.multiline();
}).tag("multiline");

Scenario.todo("SHOULD convey its spellcheck state");
Scenario.todo("SHOULD convey its required state");
Scenario.todo("SHOULD convey its readonly state");
Scenario.todo("SHOULD convey its disabled state");
Scenario.todo("SHOULD convey its minlength state");
Scenario.todo("SHOULD convey its maxlength state");
Scenario.todo("SHOULD convey its autocomplete state");