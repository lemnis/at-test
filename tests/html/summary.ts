import snapshot from "snap-shot-it";
import { expect } from "../utils/expect";
import { ASSISTIVE_TECHNOLOGY, getAT } from "../utils/setup";

Feature("Summary").tag("html/summary");

const html = /*html*/ `
  <button id="start" aria-label="start">start</button>
  <details>
    <summary id="test">Title</summary>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi ipsum
    reprehenderit dolore quo autem ad eaque officia non quisquam vel.
  </details>
`;

Scenario("MUST convey its name", async ({ I }) => {
  I.setContent(html);
  I.focus("#start");
  I.nextFocusableItem();
  const ax = await I.grabATOutput("#test");
  expect(ax).to.have.name("Title");
  snapshot(ax as any);
}).tag("name");

Scenario("MUST convey its role", async ({ I }) => {
  I.setContent(html);
  I.focus("#start");
  I.nextFocusableItem();
  const ax = await I.grabATOutput("#test");
  expect(ax).to.have.role([
    "Summary",
    "summary",
    "DisclosureTriangle",
    "disclosure triangle",
  ]);
  snapshot(ax as any);
}).tag("role");

Scenario("MUST convey the expanded state", async ({ I }) => {
  I.setContent(html);

  I.focus("#start");
  I.nextItem?.();
  let ax = await I.grabATOutput("#test");
  expect(ax).to.be.collapsed();
  snapshot(ax as any);

  I.click("#test");
  ax = await I.grabATOutput("#test");
  expect(ax).to.be.expanded();
  snapshot(ax as any);
}).tag("expanded");

([ASSISTIVE_TECHNOLOGY.VOICEOVER, ASSISTIVE_TECHNOLOGY.CHROMEVOX].includes(
  getAT()
)
  ? ["nextItem", "nextFocusableItem", "nextControlItem"]
  : ["nextFocusableItem"]
).forEach((nav) => {
  Scenario(
    `SHOULD provide shortcuts to jump to this role - ${nav}`,
    async ({ I }) => {
      I.setContent(html);
      I.focus("#start");
      I[nav]();
      const ax = await I.grabATOutput("#test");
      expect(ax).to.have.name("Title");
      snapshot(ax as any);
    }
  ).tag("shortcuts");
});

if (getAT() === ASSISTIVE_TECHNOLOGY.VOICEOVER) {
  Scenario(
    `SHOULD provide shortcuts to jump to this role - rotor`,
    async function (this: any, { I }) {
      I.setContent(html);
      I.focus("#start");

      (I as any).rotor({
        menu: "Form Controls",
        find: "Title",
      });
      // TODO: Wait till rotor is closed / cursor is on button
      I.wait(2);

      const ax = await I.grabATOutput("#test");
      expect(ax).to.have.name("Title");
      snapshot(ax as any);
    }
  ).tag("base");
}
