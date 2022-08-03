import { expect } from "../utils/expect";
import snapshot from "snap-shot-it";
import { ASSISTIVE_TECHNOLOGY, getAT } from "../utils/setup";

xFeature("Strong").tag("html/strong");

const html = /*html*/ `
  <button id="start">start</button>
  <p><strong id="test">This is important!</strong>, really?</p>
  <button id="end">end</button>
`;

Scenario("MUST convey its role when having a id", async ({ I }) => {
  I.setContent(html);
  await I.focus("#start");
  await I.nextItem?.();

  const ax = await I.grabATOutput("#test", { includeIgnored: true });

  if ([ASSISTIVE_TECHNOLOGY.NONE].includes(getAT())) {
    expect(ax).to.have.role("strong");
  } else {
    expect(ax).to.have.exactName("This is important!");
    await I.nextItem?.();
    await I.nextItem?.();
    expect(await I.grabFocusedElement()).to.have.name("end");
  }
  snapshot(ax as any);
}).tag("role");

Scenario.skip("MUST not be accessible when having no id", async ({ I }) => {
  I.setContent(`
    <button id="start">start</button>
    <p><strong>This is important!</strong>, really?</p>
    <button id="end">end</button>
  `);
  await I.focus("#start");
  await I.nextItem?.();

  const ax = await I.grabATOutput("strong", { includeIgnored: true });

  if ([ASSISTIVE_TECHNOLOGY.NONE].includes(getAT())) {
    expect(ax).to.be.undefined;
  } else {
    snapshot(ax as any);
    expect(ax).to.have.exactName("This is important!, really?");
    await I.wait(4);
    await I.nextItem?.();
    expect(await I.grabFocusedElement()).to.have.name("end");
  }
  await I.wait(5);
}).tag("role");
