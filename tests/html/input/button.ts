import snapshot from "snap-shot-it";
import { expect } from "../../utils/expect";
import { getAT, ASSISTIVE_TECHNOLOGY } from "../../utils/setup";

Feature("Button").tag("html/input/button");

const html = (prop?: string, value?: string) =>
  /*html*/ `<button id="start" aria-label="start">start</button><input id="test" ${
    prop ? (value ? `${prop}="${value}"` : prop) : ""
  } type="button" value="Foo" />`;

Scenario("MUST convey its role & name", async ({ I }) => {
  I.setContent(html());

  I.focus("#start");
  I.nextItem?.();

  const ax = await I.grabATOutput("#test");
  expect(ax).to.have.role(["button", "Button"]).and.have.name("Foo").and.not.be
    .disabled;
  snapshot(ax as any);
}).tag("base");

Scenario("MUST convey disabled state", async ({ I }) => {
  I.setContent(html("disabled"));

  I.focus("#start");
  I.nextItem?.();
  I.nextFocusableItem;

  const ax = await I.grabATOutput("#test");
  expect(await I.grabATOutput("#test")).to.be.disabled;
  snapshot(ax as any);
}).tag("disabled");

([ASSISTIVE_TECHNOLOGY.VOICEOVER, ASSISTIVE_TECHNOLOGY.CHROMEVOX].includes(
  getAT()
)
  ? ["nextItem", "nextFocusableItem", "nextControlItem"]
  : ["nextFocusableItem"]
).forEach((nav) => {
  Scenario(
    `SHOULD provide shortcuts to jump to this role - ${nav}`,
    async ({ I }) => {
      I.setContent(html());

      expect(I).to.have.property(nav);

      I.focus("#start");
      I[nav]?.();

      const ax = await I.grabATOutput("#test");
      expect(await I.grabFocusedElement()).to.have.name("Foo");
      snapshot(ax as any);
    }
  ).tag("base");
});

if (getAT() === ASSISTIVE_TECHNOLOGY.VOICEOVER) {
  Scenario(
    `SHOULD provide shortcuts to jump to this role - rotor`,
    async function (this: any, { I }) {
      I.setContent(html());

      I.focus("#start");
      (I as any).rotor({
        menu: "Form Controls",
        find: "Foo",
      });
      // TODO: Wait till rotor is closed / cursor is on button
      I.wait(2);

      const ax = await I.grabATOutput("#test");
      expect(await I.grabFocusedElement()).to.have.name("Foo");
      snapshot(ax as any);
    }
  ).tag("base");
}
