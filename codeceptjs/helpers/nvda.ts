/// <reference path="../steps.d.ts" />

import { platform } from "os";
import { BrowserContext, ConsoleMessage, Page } from "playwright";
import { ATHelper } from "./base";
import { focus, getFocusedElement } from "./browser-actions/focus";
import {
  nextFocusableItem,
  performDefaultAction,
  previousFocusableItem,
} from "./browser-actions/keyboard";
import {
	awaitNvdaRecording,
	createSpeechRecorder,
    Speech,
    SpeechLine
} from "screen-reader-testing-library";

class NVDA extends Helper implements ATHelper {
  recorder: any;

  private lastPhrase = () => {
    return SpeechLine;
  };

  async _init() {
    await awaitNvdaRecording();
    this.recorder = createSpeechRecorder(logFilePath);
  }

  async grabATOutput(locator: CodeceptJS.LocatorOrString) {
    return {
      spoken: this.lastPhrase()?.join(', '),
      output: {
        phrase: this.lastPhrase(),
        phrases: Speech()
      },
    };
  }

  async focus(locator: CodeceptJS.LocatorOrString) {
    return focus(locator, this.helpers);
  }

  async grabFocusedElement() {
    return getFocusedElement(this.helpers);
  }

  async nextItem() {
    const page: Page = this.helpers.Playwright.page;
    await page.keyboard.press("ArrowDown");
  }

  async previousItem() {
    const page: Page = this.helpers.Playwright.page;
    await page.keyboard.press("ArrowUp");
  }

  async performDefaultAction() {
    return performDefaultAction(this.helpers);
  }

  async nextFocusableItem() {
    return nextFocusableItem(this.helpers);
  }

  async previousFocusableItem() {
    return previousFocusableItem(this.helpers);
  }
}

export = NVDA;
