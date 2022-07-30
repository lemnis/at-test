/// <reference path="./steps.d.ts" />
import { VoiceOver as VO, moveRight, activate } from "@accesslint/voiceover";
import { ATHelper } from "./helpers/base";
import { focus, getFocusedElement } from "./helpers/browser-actions/focus";
import { KEY_CODES } from "./helpers/voiceover/voiceover.constants";
import {
  nextFocusableItem,
  previousFocusableItem,
  performDefaultAction,
} from "./helpers/browser-actions/keyboard";
import {
  stopWindowManagment,
  startWindowManagement,
} from "./voiceover/window-management";
import { exec } from "child_process";
import { promisify } from "util";
import { NATIVE_WINDOWS } from "./voiceover/voiceover.constants";
import { ElementHandle, Page } from "playwright";
import { domCursor, matchCursors, voCursor } from "./voiceover/cursors";
import { VoiceOverController } from "./voiceover/controller";
const { screenshotOutputFolder } = require("codeceptjs/lib/utils.js");

const voiceOver = new VoiceOverController({ log: false });
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
      await voiceOver.seek({ text: "Not Now", tries: 10 });
      await voiceOver.pressKey("Return");

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

  async grabATOutput(
    locator?: CodeceptJS.LocatorOrString,
    { checkCursor = true, includeIgnored = false } = {}
  ) {
    if (
      checkCursor &&
      locator &&
      !(await matchCursors(this.helpers, locator))
    ) {
      const playwright: Omit<CodeceptJS.Playwright, "_locate"> &
        Record<string, any> = this.helpers.Playwright;
      const page: Page = playwright.page;
      const elements: ElementHandle[] = await playwright._locate(locator);
      console.log(locator);
      console.log(await domCursor(page, elements?.[0]!));
      console.log(await voCursor());
      throw new Error("Unexpected VoiceOver cursor");
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
    await voiceOver.execute({
      name: "Move to next form contrl",
      description: "VO+CMD+J",
      keyCode: 38,
      modifiers: ["control down", "option down", "command"],
    });
  }

  async nextGraphicItem() {
    await voiceOver.pressKey(5, ["control down", "option down", "command down"]);
  }

  async rotor(...args: Parameters<typeof voiceOver["rotor"]>) {
    await voiceOver.rotor(...args);
  }

  async pressEscape() {
    await voiceOver.execute({
      keyCode: KEY_CODES.Escape,
      modifiers: [],
    });
  }

  async pressArrowDown() {
    await voiceOver.execute({
      keyCode: KEY_CODES.ArrowDown,
      modifiers: [],
    });
  }

  async pressArrowUp() {
    await voiceOver.execute({
      keyCode: KEY_CODES.ArrowUp,
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

    const outputFile = screenshotOutputFolder(fileName);
    return await promisify(exec)(`screencapture ${outputFile}`);
  }
}

export = VoiceOver;
