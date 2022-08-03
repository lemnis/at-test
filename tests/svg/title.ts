import { expect } from "../utils/expect";
import snapshot from "snap-shot-it";

Feature("Title").tag("svg/title");

const html = /*html*/ `
  <button id="start">start</button>
  <svg version="1.1" width="50" height="50" id="target">
    <title>red square</title>
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
