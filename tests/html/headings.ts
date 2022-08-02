import snapshot from "snap-shot-it";
import { expect } from "../utils/expect";
import { getAT, ASSISTIVE_TECHNOLOGY } from "../utils/setup";

Feature("Headings").tag("html/h1");

const html = (prop?: string, value?: string) =>
  /*html*/ `<button id="start" aria-label="start">start</button><h1 id="test">Foo</h1>`;

Scenario("MUST convey its role", async ({ I }) => {
  I.setContent(html());

  I.focus("#start");
  I.nextItem?.();

  const ax = await I.grabATOutput("#test");
  console.log(ax);
  expect(ax).to.have.role("heading").and.have.name("Foo").and.have.level(1)
  snapshot(ax as any);
}).tag("base");
