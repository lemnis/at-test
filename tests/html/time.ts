import { expect } from "../utils/expect";
import snapshot from "snap-shot-it";
import { ASSISTIVE_TECHNOLOGY, getAT } from "../utils/setup";

xFeature("Time").tag("html/time");

const html = /*html*/ `
  <button id="start">start</button>
  <time datetime="2007-08-29T13:58Z" id="test">Yesterday</time>
  <button id="end">end</button>
`;

Scenario("MUST convey its role", async ({ I }) => {
  I.setContent(html);

  if (
    [ASSISTIVE_TECHNOLOGY.VOICEOVER, ASSISTIVE_TECHNOLOGY.CHROMEVOX].includes(
      getAT()
    )
  ) {
    await I.focus("#start");
    await I.nextItem?.();
  }

  const ax = await I.grabATOutput("#test", { includeIgnored: true });
  snapshot(ax as any);
  expect(ax).to.have.role("time");

  if (
    [ASSISTIVE_TECHNOLOGY.VOICEOVER, ASSISTIVE_TECHNOLOGY.CHROMEVOX].includes(
      getAT()
    )
  ) {
    await I.nextItem?.();
    expect(await I.grabFocusedElement()).to.have.name("end");
  }
}).tag("role");
