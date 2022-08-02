import snapshot from "snap-shot-it";
import { expect } from "../utils/expect";
import { getAT, ASSISTIVE_TECHNOLOGY } from "../utils/setup";

Feature("Textarea").tag("html/textarea");

const html = /*html*/ `<button id="start" type="button">start</button><textarea id="test"></textarea>`;
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

Scenario("Should be focusable", async ({ I }) => {
  I.setContent(html);
  I.focus("#start");
  I.nextFocusableItem();
  expect(await I.grabFocusedElement()).to.have.property("focused", true);
}).tag("focusable");

Scenario("Should have role", async ({ I }) => {
  I.setContent(html);

  if (
    [ASSISTIVE_TECHNOLOGY.VOICEOVER, ASSISTIVE_TECHNOLOGY.CHROMEVOX].includes(
      getAT()
    )
  ) {
    I.focus("#start");
    I.nextItem?.();
  }

  expect(await I.grabATOutput("#test")).to.have.role([
    "textbox",
    "text area",
    "edit text",
  ]);
}).tag("role");

navigation.forEach((nav) => {
  Scenario(`Should convey its name - ${nav}`, async ({ I }) => {
    I.setContent(htmlWithLabel);
    I.focus("#start");
    I[nav]?.();
    expect(await I.grabATOutput("#test")).to.have.name("Foo");
  }).tag("name");
});

if (getAT() === ASSISTIVE_TECHNOLOGY.VOICEOVER) {
  Scenario(`Should convey its name - rotor`, async function (this: any, { I }) {
    I.setContent(htmlWithLabel);
    I.focus("#start");
    (I as any).rotor({
      menu: "Form Controls",
      find: "Foo",
    });
    expect(await I.grabATOutput("#test")).to.have.name("Foo");
  }).tag("name");
}

Scenario("Should be multiline", async ({ I }) => {
  I.setContent(html);

  if (
    [ASSISTIVE_TECHNOLOGY.VOICEOVER, ASSISTIVE_TECHNOLOGY.CHROMEVOX].includes(
      getAT()
    )
  ) {
    I.focus("#start");
    I.nextItem?.();
  }

  expect(await I.grabATOutput("#test")).to.be.multiline();
}).tag("multiline");
