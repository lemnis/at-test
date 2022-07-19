/// <reference path="./steps.d.ts" />
import { VoiceOver, moveRight } from "@accesslint/voiceover";

import { ElementHandle, Page } from "playwright";

type AccessibilityNode = Awaited<ReturnType<Page["accessibility"]["snapshot"]>>;
interface ScreenReaderHelper {
  nextItem(): void;
  previousItem(): void;
  performDefaultAction(): void;
}

const voiceOver = new VoiceOver();

class VoiceOverHelper extends Helper implements ScreenReaderHelper {
  private lastPhrase = async () => {
    return voiceOver.lastPhrase();
  };

  protected async _before() {
    await voiceOver.launch();
  }

  protected async _after() {
    await voiceOver.quit();
  }

  async grabATOutput(locator: CodeceptJS.LocatorOrString) {
    return { spoken: await this.lastPhrase() };
  }

  private findFocusedNode(node: AccessibilityNode): AccessibilityNode {
    if (node?.focused) return node;
    for (const child of node?.children || []) {
      const foundNode = this.findFocusedNode(child);
      if (foundNode) return foundNode;
    }
    return null;
  }

  async grabFocusedElement() {
    const page: Page = this.helpers.Playwright.page;
    const snapshot = await page.accessibility.snapshot();
    return this.findFocusedNode(snapshot);
  }

  async focus(locator: CodeceptJS.LocatorOrString) {
    const elements: ElementHandle[] = await this.helpers.Playwright._locate(
      locator
    );
    return elements[0]?.focus();
  }

  async nextItem() {
    await voiceOver.execute(moveRight);
  }

  async previousItem() {
    await voiceOver.keyStrokes({ text: "ArrowLeft" });
  }

  async performDefaultAction() {
    const page: Page = this.helpers.Playwright.page;
    await page.keyboard.press("Enter");
  }
}

export = VoiceOverHelper;
