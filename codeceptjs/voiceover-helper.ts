/// <reference path="./steps.d.ts" />
import { VoiceOver, moveRight } from "@accesslint/voiceover";
import { ElementHandle, Page } from "playwright";
import { exec } from "child_process";
import { promisify } from "util";

type AccessibilityNode = Awaited<ReturnType<Page["accessibility"]["snapshot"]>>;
interface ScreenReaderHelper {
  nextItem(): void;
  previousItem(): void;
  performDefaultAction(): void;
}

let lastTimestamp = Date.now();
let previousPrase: string;

const voiceOver = new VoiceOver({ log: true });
const logCheck = setInterval(() => {
  voiceOver.lastPhrase().then((phrase) => {
    if (phrase != previousPrase) {
      lastTimestamp = Date.now();
      previousPrase = phrase;
    }

    if (Date.now() - lastTimestamp > 15000) {
      console.log("Stuck on phrase", phrase);
      // voiceOver
      //   .execute({
      //     name: "Escape",
      //     keyCode: 53,
      //     modifiers: [],
      //   })
      Promise.resolve()
        .then(() =>
          voiceOver.execute({
            name: "Move Up",
            description: "VO+up arrow",
            keyCode: 126,
            modifiers: ["control down", "option down"],
          })
        )
        .then(() =>
          promisify(exec)(
            `osascript ${__dirname}/voiceover/dismiss-notification.js`
          ).catch(() => {})
        )
        .then(() => voiceOver.lastPhrase())
        .then(
          (newPhrase) => {
            if (newPhrase === phrase) {
              console.log("got stuck, exiting");
              process.exit(1);
            } else {
              console.log("Got unstuck");
            }
          },
          () => {
            console.log("got stuck, error!");
            process.exit(1);
          }
        );
    }
  });
}, 500);

class VoiceOverHelper extends Helper implements ScreenReaderHelper {
  protected _beforeSuite(suite: Mocha.Suite): void {
    console.log(`Suite: I.${suite.tags}`);
  }
  protected _beforeStep(step: CodeceptJS.Step): void {
    console.log(`Step: I.${step.name}`);
  }

  private lastPhrase = async () => {
    return voiceOver.lastPhrase();
  };

  protected async _init() {
    return new Promise((resolve, reject) => {
      voiceOver.launch().then(resolve);
      setTimeout(() => reject("Failed to start"), 5000);
      // voiceOver.record({ file: 'recording.mov' });
    });
  }

  protected async _finishTest() {
    return new Promise((resolve, reject) => {
      voiceOver.quit().then(resolve);
      clearInterval(logCheck);
      setTimeout(() => reject("Failed to start"), 5000);
    });
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

  async pressEscape() {
    await voiceOver.execute({
      name: "Escape",
      keyCode: 53,
      modifiers: [],
    });
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
