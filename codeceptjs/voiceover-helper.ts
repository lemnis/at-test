/// <reference path="./steps.d.ts" />
import { VoiceOver as VO, moveRight, activate } from "@accesslint/voiceover";
import { ATHelper } from "./helpers/base";
import { focus, getFocusedElement } from "./helpers/browser-actions/focus";
import { KEY_CODES } from "./helpers/voiceover/voiceover.constants";
import {
  nextFocusableItem,
  performDefaultAction,
} from "./helpers/browser-actions/keyboard";
import {
  stopWindowManagment,
  startWindowManagement,
} from "./voiceover/window-management";
import { exec } from "child_process";
import { promisify } from "util";
import { NATIVE_WINDOWS } from "./voiceover/voiceover.constants";

const voiceOver = new VO({ log: true });
class VoiceOver extends Helper implements ATHelper {
  // _before - before a test
  // _after - after a test
  // _beforeStep - before each step
  // _afterStep - after each step
  // _beforeSuite - before each suite
  // _afterSuite - after each suite
  // _passed - after a test passed
  // _failed - after a test failed

  async _beforeStep() {
    const phrase = await voiceOver.lastPhrase();
    if (
      phrase.includes(NATIVE_WINDOWS.DICTATION) ||
      phrase.includes(
        "You can configure your microphone in Dictation preferences."
      )
    ) {
      console.log("Warning: Dictaction modal detected, trying to close.");
      await voiceOver.advance({ target: { text: "Not Now" }, steps: 10 });
      await voiceOver.execute({
        name: "Activate",
        description: "Enter",
        keyCode: KEY_CODES.RETURN,
        modifiers: [],
      });
      if ((await voiceOver.lastPhrase()) !== phrase) {
        throw new Error("Got stuck on dictaction");
      }
    } else if (phrase.includes("Notification")) {
      await promisify(exec)(
        `osascript ${__dirname}/voiceover/dismiss-notification.js`
      ).catch(() => {});
      if ((await voiceOver.lastPhrase()) !== phrase) {
        throw new Error("Got stuck on notification");
      }
    }
  }

  protected async _init() {
    return new Promise((resolve, reject) => {
      // startWindowManagement(voiceOver);
      voiceOver.launch().then(resolve);
      setTimeout(() => reject("Failed to start"), 5000);
    });
  }

  protected async _finishTest() {
    // stopWindowManagment();
    await voiceOver.quit();
  }

  private lastPhrase = async () => {
    return voiceOver.lastPhrase();
  };

  async grabATOutput(locator: CodeceptJS.LocatorOrString) {
    return { spoken: await this.lastPhrase() };
  }

  getDescription() {
    // Wait a x of amount of time, till the description is been read
    return new Promise((a) => setTimeout(a, 4000));
  }

  async grabFocusedElement() {
    return getFocusedElement(this.helpers);
  }

  async focus(locator: CodeceptJS.LocatorOrString) {
    return focus(locator, this.helpers);
  }

  async nextItem() {
    await voiceOver.execute(moveRight);
  }

  async nextFocusableItem() {
    return nextFocusableItem(this.helpers);
  }

  async nextControlItem() {
    await voiceOver.execute({
      name: "Move to next form contrl",
      description: "VO+CMD+J",
      keyCode: KEY_CODES.J,
      modifiers: ["control down", "option down", "command"],
    });
  }

  async rotor(...args: Parameters<typeof voiceOver["rotor"]>) {
    await voiceOver.rotor(...args);
  }

  async pressEscape() {
    await voiceOver.execute({
      name: "Escape",
      keyCode: KEY_CODES.ESCAPE,
      modifiers: [],
    });
  }

  async pressArrowDown() {
    await voiceOver.execute({
      name: "Escape",
      keyCode: KEY_CODES.ARROW_DOWN,
      modifiers: [],
    });
  }

  async pressArrowUp() {
    await voiceOver.execute({
      name: "Escape",
      keyCode: KEY_CODES.ARROW_UP,
      modifiers: [],
    });
  }

  async clickNext() {
    await voiceOver.execute(activate);
  }

  async previousItem() {
    await voiceOver.keyStrokes({ text: "ArrowLeft" });
  }

  async performDefaultAction() {
    return performDefaultAction(this.helpers);
  }

  async saveScreenshot(fileName: string, fullPage: boolean) {
    if (fullPage)
      return this.helpers.Playwright.saveScreenshot(fileName, fullPage);

    return await promisify(exec)(`screencapture ${fileName}`);
  }
}

export = VoiceOver;
