/// <reference path="../steps.d.ts" />
import { Page } from "playwright";
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
    Recorder
} from "screen-reader-testing-library";

class NVDA extends Helper implements ATHelper {
  recorder?: Recorder;

  private lastPhrase = async () => {
    const s = this.recorder?.stop();
    this.recorder?.start();
    return s;
  };

  _before() {
    this.recorder?.start();
  }

  async _init() {
    await awaitNvdaRecording();
    const logFilePath = __dirname + "/../../nvda-node.log";
    this.recorder = createSpeechRecorder(logFilePath);
  }

  async grabATOutput(locator: CodeceptJS.LocatorOrString) {
    const phrase = await this.lastPhrase();
    return {
      spoken: phrase?.join(', '),
      output: {
        phrase: phrase?.join(',') || '',
        phrases: phrase?.flat()
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
