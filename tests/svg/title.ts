import { expect } from "../utils/expect";
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

const htmlWithRole = /*html*/ `
  <button id="start">start</button>
  <svg version="1.1" width="50" height="50" id="target" role="img">
    <title>red square</title>
    <rect width="50" height="50" fill="#cc0000" />
  </svg>
`;

const navigation =
  getAT() == ASSISTIVE_TECHNOLOGY.VOICEOVER
    ? ["nextItem", "nextGraphicItem"]
    : ["nextItem"];

navigation.forEach((nav) => {
  Scenario(`Should convey its role - ${nav}`, async ({ I }) => {
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

  Scenario(`Should convey its role when explicit - ${nav}`, async ({ I }) => {
    I.setContent(htmlWithRole);
    I.focus("#start");
    I[nav]?.();

    const ax = await I.grabATOutput("#target");
    expect(ax).to.have.role(["image", "img"]);
    expect(ax).to.have.name("red square");
    snapshot(ax as any);
  }).tag("role");
});

Scenario(`Should convey its name`, async ({ I }) => {
  I.setContent(html);
  I.focus("#start");
  I.nextItem?.();

  const ax = await I.grabATOutput("#target");
  expect(ax).to.have.name("red square");
  snapshot(ax as any);
}).tag("name");
