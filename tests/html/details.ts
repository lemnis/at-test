import { expect } from "chai";
import snapshot from "snap-shot-it";
import { ASSISTIVE_TECHNOLOGY, getAT } from "../utils/setup";

Feature("Details").tag("html/details");

const html = (label?: string, role?: string) => /*html*/ `
  <button id="start">start</button>
  <details
    id="test"
    ${label ? `aria-label="${label}"` : ""}
    ${role ? `role="${role}"` : ""}
  >
    <summary id="summary">Summary title</summary>
    Lorem ipsum dolor sit amet.
  </details>
  <button id="end">end</button>
`;

Scenario("Should not be targetable", async ({ I }) => {
  I.setContent(html());
  if ([ASSISTIVE_TECHNOLOGY.VOICEOVER].includes(getAT())) {
    await I.focus("#start");
    await I.nextItem?.();
    expect(
      await I.grabATOutput("#summary", { includeIgnored: true })
    ).to.have.name("Summary title");
    await I.nextItem?.();
    expect(await I.grabATOutput("#end", { includeIgnored: true })).to.have.name(
      "end"
    );
  } else {
    expect(await I.grabATOutput("#test")).to.be.null;
  }
}).tag("ignored");

Scenario(
  "Should convey role OR conveyed as presentational",
  async function (this: any, { I }) {
    I.setContent(html());
    I.focus("#start");
    I.nextItem?.();

    const ax = await I.grabATOutput("#test", { includeIgnored: true });
    if ([ASSISTIVE_TECHNOLOGY.VOICEOVER].includes(getAT())) {
      // Expect voiceover to convey it as presentational, as such it should have been skipped.
      expect(ax).to.have.role("summary");
    } else {
      expect(ax).to.have.role(["Details", "details"]);
    }
  }
).tag("role");

Scenario(
  "Should hide / show content depending on expanded state",
  async ({ I }) => {
    I.setContent(html());

    if (getAT() === ASSISTIVE_TECHNOLOGY.VOICEOVER) {
      I.focus("#start");
      I.nextItem?.();
      I.nextItem?.();
      expect(await I.grabFocusedElement()).to.have.property("name", "end");
    } else {
      const root = await I.grabATOutput();
      snapshot(
        (await I.grabATOutput(undefined, { includeIgnored: true })) as any
      );
      expect(root?.children).to.have.length(1);
    }

    I.click("#test");

    if (getAT() === ASSISTIVE_TECHNOLOGY.VOICEOVER) {
      I.focus("#start");
      I.nextItem?.();
      I.nextItem?.();
      I.nextItem?.();
      expect(await I.grabFocusedElement()).to.have.property("name", "end");
    } else {
      const root = await I.grabATOutput();
      snapshot(
        (await I.grabATOutput(undefined, { includeIgnored: true })) as any
      );
      expect(root?.children?.[1] || root).to.have.name(
        "Lorem ipsum dolor sit amet."
      );
    }
  }
).tag("hideContent");
