import snapshot from "snap-shot-it";
import { expect } from "../utils/expect";
import { ASSISTIVE_TECHNOLOGY, getAT } from "../utils/setup";

Feature("HTMLDialogElement").tag("api/HTMLDialogElement");

const html = /*html*/ `
  <button id="start">start</button>
  <dialog>
    <button id="inside">Button inside modal</button>
  </dialog>
  <button id="outside">Button outside modal</button>
`;

Scenario(
  "When closed it and his children should be ignored",
  async ({ I }) => {
    I.setContent(html);

    if ([ASSISTIVE_TECHNOLOGY.VOICEOVER].includes(getAT())) {
      I.focus("#start");
      I.nextItem?.();
    }
    let root = await I.grabATOutput(undefined);
    expect(await I.grabATOutput("#outside")).to.have.name(
      "Button outside modal"
    );
    if ([ASSISTIVE_TECHNOLOGY.NONE].includes(getAT())) {
      expect(root?.children).to.have.length(2);
    } else {
      await I.nextItem?.();
      expect(
        await I.grabATOutput(undefined, { checkCursor: false })
      ).to.not.have.name("Button inside modal");
      // TODDO: Detect movement of screen reader
    }
    snapshot(root as any);
  }
).tag("closed");

Scenario(
  "When opened as modal only his children should be visiblein the accessibility tree",
  async ({ I }) => {
    I.setContent(html);
    I.executeScript(() => {
      (document.querySelector("dialog") as any)!.showModal();
    });

    const root = await I.grabATOutput(undefined);
    expect(root?.children?.[0] || root).to.have.name("Button inside modal");
    expect(await I.grabFocusedElement()).to.have.name("Button inside modal");
    
    if ([ASSISTIVE_TECHNOLOGY.NONE].includes(getAT())) {
      expect(root?.children).to.have.length(1);
    } else {
      await I.nextItem?.();
      expect(await I.grabATOutput()).to.not.have.name("Button outside modal");
      // TODO: Detect movement of screen reader
    }
    snapshot(root as any);
  }
).tag("showAndFocus");

// TODO: fix checking focus of buttons
Scenario(
  "When opened normally the accessibility tree should include all elements",
  async ({ I }) => {
    I.setContent(html);
    I.executeScript(() => {
      document.querySelector("dialog")!.show();
    });

    let root = await I.grabATOutput(undefined);
    expect(root?.children?.[1] || root).to.have.name("Button inside modal");
    expect(await I.grabFocusedElement()).to.have.name("Button inside modal");

    if (
      [ASSISTIVE_TECHNOLOGY.VOICEOVER, ASSISTIVE_TECHNOLOGY.CHROMEVOX].includes(
        getAT()
      )
    ) {
      await I.nextItem?.();
    }

    root = await I.grabATOutput(undefined);

    expect(root?.children?.[1] || root).to.have.name("Button outside modal");
    snapshot(root as any);
  }
).tag("showAndFocus");

Scenario("Pressing Escape should hide the modal", async ({ I }) => {
  I.setContent(html);
  I.executeScript(() => {
    (document.querySelector("dialog") as any)!.showModal();
  });

  let root = await I.grabATOutput(undefined);
  // equal(root?.children?.length, 1);
  expect(root?.children?.[0] || root).to.have.name("Button inside modal");
  // equal(root?.children?.[0]?.focused, true);

  I.pressKey("Escape");

  root = await I.grabATOutput(undefined);
  // equal(root?.children?.length, 1);

  expect(root?.children?.[0] || root).to.have.name("Button outside modal");
  snapshot(root as any);
}).tag("pressEscape");
