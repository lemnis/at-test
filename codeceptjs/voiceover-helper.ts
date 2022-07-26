/// <reference path="./steps.d.ts" />
import { VoiceOver, moveRight, activate } from "@accesslint/voiceover";
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
import { exec } from 'child_process';
import { promisify } from 'util';

const voiceOver = new VoiceOver({ log: true });
class VoiceOverHelper extends Helper implements ATHelper {
  // _before - before a test
  // _after - after a test
  // _beforeStep - before each step
  // _afterStep - after each step
  // _beforeSuite - before each suite
  // _afterSuite - after each suite
  // _passed - after a test passed
  // _failed - after a test failed

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
    if(fullPage) return this.helpers.Playwright.saveScreenshot(fileName, fullPage);
    
    return await promisify(exec)(`screencapture ${fileName}`);
  }
}

export = VoiceOverHelper;
