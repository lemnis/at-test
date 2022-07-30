import { expect } from "chai";
import snapshot from "snap-shot-it";
import { ASSISTIVE_TECHNOLOGY, getAT } from "../utils/setup";

Feature("Title").tag("svg/title");

const html = /*html*/ `
  <button id="start">start</button>
  <svg version="1.1" width="50" height="50" id="target">
    <title>red square</title>
    <rect width="50" height="50" fill="#cc0000" />
  </svg>
`;

const navigation = (() => {
  if (getAT() === ASSISTIVE_TECHNOLOGY.VOICEOVER) {
    return ["nextItem", "nextGraphicItem"];
  }
  return ["nextItem"];
})();

navigation.forEach((nav) => {
  Scenario.only(`Should convey its role - ${nav}`, async ({ I }) => {
    I.setContent(html);
    I.focus("#start");
    I[nav]?.();
    expect(await I.grabATOutput("#target")).to.have.role([
      "Graphic",
      "image",
      "diagram",
      "img",
    ]);
  }).tag("role");
});

Scenario(`Should convey its name`, async ({ I }) => {
  I.setContent(html);
  I.focus("#start");
  I.nextItem?.();
  expect(await I.grabATOutput("#target")).to.have.name("red square");
}).tag("name");
