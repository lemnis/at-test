/// <reference path="./steps.d.ts" />
import { VoiceOver, moveRight, activate } from "@accesslint/voiceover";
import { ATHelper } from "./helpers/base";
import { focus, getFocusedElement } from "./helpers/browser-actions/focus";
import { KEY_CODES } from "./helpers/voiceover/voiceover.constants";
import {
  nextFocusableItem,
  performDefaultAction,
} from "./helpers/browser-actions/keyboard";
import { stopWindowManagment, startWindowManagement } from "./voiceover/window-management";

const voiceOver = new VoiceOver({ log: true });
class VoiceOverHelper extends Helper implements ATHelper {
  // protected _beforeSuite(suite: Mocha.Suite): void {
  //   console.log(`Suite: I.${suite.tags}`);
  // }
  // protected _beforeStep(step: CodeceptJS.Step): void {
  //   console.log(`Step: I.${step.name}`);
  // }

  private lastPhrase = async () => {
    return voiceOver.lastPhrase();
  };

  protected async _init() {
    return new Promise((resolve, reject) => {
      voiceOver.launch().then(resolve);
      startWindowManagement(voiceOver);
      setTimeout(() => reject("Failed to start"), 5000);
      // voiceOver.record({ file: 'recording.mov' });
    });
  }

  protected async _finishTest() {
    return new Promise((resolve, reject) => {
      voiceOver.quit().then(resolve);
      stopWindowManagment();
      setTimeout(() => reject("Failed to start"), 5000);
    });
  }

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
}

export = VoiceOverHelper;
