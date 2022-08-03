import { expect } from "../../utils/expect";
import snapshot from "snap-shot-it";
import { ASSISTIVE_TECHNOLOGY, getAT } from "../../utils/setup";

Feature("Time").tag("aria/role/time");

const html = /*html*/ `
  <button id="start">start</button>
  <div id="test" role="time">Today</div>
  <button id="end">end</button>
`;

xScenario("MUST convey its role	", async ({ I }) => {
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
    expect(await I.grabFocusedItem()).to.have.name("end");
  }
}).tag("role");
