import { expect } from "chai";
import snapshot from "snap-shot-it";

Feature("Figcaption").tag("html/figcaption");

const helpers = codeceptjs.config.get("helpers");
const html = /*html*/ `
<button id="start" aria-label="start">start</button>
<figure>
  <img src="https://placekitten.com/100/100" alt="Kitten">
  <p>Non-image figure content</p>
  <figcaption id="test">Some kitten</figcaption>
</figure>`;

Scenario("Should have role", async ({ I }) => {
  I.setContent(html);

  if (helpers.ChromevoxHelper || helpers.VoiceOver) {
    I.focus("#start");
    I.nextItem?.();
    I.nextItem?.();
    I.nextItem?.();
    I.nextItem?.();
  }

  const ax = await I.grabATOutput("#test", { includeIgnored: true });
  expect(ax).to.have.role(["caption", "Figcaption"]);
  snapshot(ax as any);
}).tag("role");

Scenario("Should have name", async ({ I }) => {
  I.setContent(html);

  if (helpers.ChromevoxHelper || helpers.VoiceOver) {
    I.focus("#start");
    I.nextItem?.();
    I.nextItem?.();
    I.nextItem?.();
    I.nextItem?.();
  }

  const ax = await I.grabATOutput("#test", { includeIgnored: true });
  expect(ax?.children?.[0] || ax).to.have.name("Some kitten");
  snapshot(ax as any);
}).tag("name");
