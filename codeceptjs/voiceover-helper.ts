/// <reference path="./steps.d.ts" />
import { VoiceOver as VO, moveRight, activate } from "@accesslint/voiceover";
import { ATHelper } from "./helpers/base";
import { focus, getFocusedElement } from "./helpers/browser-actions/focus";
import {
  nextFocusableItem,
  previousFocusableItem,
  performDefaultAction,
} from "./helpers/browser-actions/keyboard";
import {
  stopWindowManagment,
  startWindowManagement,
} from "./voiceover/window-management";
import { exec, spawn } from "child_process";
import { promisify } from "util";
import { domCursor, matchCursors, voCursor } from "./voiceover/cursors";
import { VoiceOverController } from "./voiceover/controller";
const { screenshotOutputFolder } = require("codeceptjs/lib/utils.js");

const voiceOver = new VoiceOverController({ log: false });
class VoiceOver extends Helper implements ATHelper {
  protected _before(): void {
    const [test]: [Mocha.Test] = arguments as any;
    const retryCount = 3;
    test.retries(retryCount);
  }

  // _after - after a test
  // _beforeSuite - before each suite
  // _afterSuite - after each suite
  // _passed - after a test passed
  // _failed - after a test failed

  async _beforeStep() {
    const phrase = await voiceOver.lastPhrase();
    if (phrase.includes("Dictation")) {
      console.log("Warning: Dictaction modal could be open, trying to close.");
      await voiceOver.pressKey("Escape");

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

      if (process.env.CI) {
        const outputFile = screenshotOutputFolder("record.mov");
        promisify(spawn)(
          "screencapture",
          ["-v", "-C", "-k", "-T0", "-g", outputFile],
          {
            detached: true,
          }
        );
      }
    });
  }

  protected async _finishTest() {
    // stopWindowManagment();
    await voiceOver.quit();
  }

  private lastPhrase = async () => {
    return voiceOver.lastPhrase();
  };

  async grabATOutput(
    locator?: CodeceptJS.LocatorOrString,
    { checkCursor = true, includeIgnored = false } = {}
  ) {
    if (
      checkCursor &&
      locator &&
      !(await matchCursors(this.helpers, locator))
    ) {
      const error = new Error("Unexpected VoiceOver cursor");
      (error as any).voCursor = await voCursor();
      (error as any).domCursor = await domCursor(this.helpers, locator);
      (error as any).locator = locator;
      throw error;
    }

    return {
      spoken: await this.lastPhrase(),
      output: await voiceOver.latestOutput(),
    };
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

  async previousFocusableItem() {
    return previousFocusableItem(this.helpers);
  }

  async nextFocusableItem() {
    return nextFocusableItem(this.helpers);
  }

  async nextControlItem() {
    await voiceOver.pressKey(38, [
      "control down",
      "option down",
      "command down",
    ]);
  }

  async nextGraphicItem() {
    await voiceOver.pressKey(5, [
      "control down",
      "option down",
      "command down",
    ]);
  }

  async rotor(...args: Parameters<typeof voiceOver["rotor"]>) {
    await voiceOver.rotor(...args);
  }

  async pressKey(key: string) {
    await voiceOver.pressKey(key);
  }

  async pressVoKey(key: string, modifiers: string[] = []) {
    await voiceOver.pressKey(key, modifiers);
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

    const outputFile = screenshotOutputFolder(fileName);
    return await promisify(exec)(`screencapture ${outputFile}`);
  }
}

export = VoiceOver;
