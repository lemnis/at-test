import { expect } from "../utils/expect";
import snapshot from "snap-shot-it";
import { ASSISTIVE_TECHNOLOGY, getAT } from "../utils/setup";

Feature("Svg").tag("svg/svg");

const html = /*html*/ `
  <button id="start">start</button>
  <svg version="1.1" width="50" height="50" id="target" aria-label="red square">
    <rect width="50" height="50" fill="#cc0000" />
  </svg>
`;

Scenario(`MUST convey its name`, async ({ I }) => {
  I.setContent(html);
  I.focus("#start");
  I.nextItem?.();

  const ax = await I.grabATOutput("#target");
  expect(ax).to.have.name("red square");
  snapshot(ax as any);
}).tag("name");

Scenario(`MUST convey its role`, async ({ I }) => {
  I.setContent(html);
  I.focus("#start");
  I.nextItem?.();

  const ax = await I.grabATOutput("#target");
  expect(ax).to.have.role(["Graphic", "image", "diagram", "img"]);
  snapshot(ax as any);
}).tag("role");

const navigation =
  getAT() == ASSISTIVE_TECHNOLOGY.VOICEOVER
    ? ["nextItem", "nextGraphicItem"]
    : ["nextItem"];

navigation.forEach((nav) => {
  Scenario(
    `SHOULD provide shortcuts to jump to this role - ${nav}`,
    async ({ I }) => {
      I.setContent(html);
      I.focus("#start");
      I[nav]();
      expect(await I.grabATOutput("#target")).to.have.name("red square");
    }
  ).tag("role");
});
