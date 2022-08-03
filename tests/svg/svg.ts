import { expect } from "../utils/expect";
import snapshot from "snap-shot-it";
import { ASSISTIVE_TECHNOLOGY, getAT } from "../utils/setup";
import { TAGS } from "../utils/tags";

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

  const ax = await I.grabATOutput("#target", { includeIgnored: true });
  snapshot(ax as any);
  expect(ax).to.have.name("red square");
}).tag(TAGS.NAME);

Scenario(`MUST convey its role`, async ({ I }) => {
  I.setContent(html);
  I.focus("#start");
  I.nextItem?.();

  const ax = await I.grabATOutput("#target", { includeIgnored: true });
  snapshot(ax as any);
  expect(ax).to.have.role(["Graphic", "image", "diagram", "img"]);
}).tag(TAGS.ROLE);

const navigation =
  getAT() == ASSISTIVE_TECHNOLOGY.VOICEOVER
    ? ["nextItem", "nextGraphicItem"]
    : [];

navigation.forEach((nav) => {
  Scenario(
    `SHOULD provide shortcuts to jump to this role - ${nav}`,
    async ({ I }) => {
      I.setContent(html);
      I.focus("#start");
      I[nav]();
      expect(await I.grabATOutput("#target")).to.have.name("red square");
    }
  ).tag(TAGS.SHORTCUTS);
});
