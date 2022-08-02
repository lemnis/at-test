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

// id : kgejglhpjiefppelpmljglcjbhoiplfn
// const params = new URLSearchParams('');
// params.append('response', 'redirect');
// params.append('os', this.platformInfo_.os);
// params.append('arch', this.platformInfo_.arch);
// params.append('nacl_arch', this.platformInfo_.nacl_arch);
// params.append('prod', 'chromiumcrx');
// params.append('prodchannel', 'unknown');
// params.append('prodversion', this.browserVersion_);
// params.append('acceptformat', 'crx2,crx3');
// params.append('x', `id=${id}&uc`);
// `https://clients2.google.com/service/update2/crx?${params}`

class ChromeVox extends Helper implements ATHelper {
  private speakOutput: any[][] = [];
  private lastPhrase = () => {
    const lastOutputArray = this.speakOutput[this.speakOutput.length - 1];
    return lastOutputArray
      ?.map((i) => i)
      .filter(Boolean)
      .join(", ");
  };

  async setContent(html: string) {
    if (this.helpers.Playwright) {
      const page: Page = this.helpers.Playwright.page;
      await page?.setContent(html);
    } else if (this.helpers.WebDriver) {
      const browser: any = this.helpers.WebDriver.browser;
      await browser.url(`data:text/html;base64,${btoa(html)}`);
    } else {
      throw new Error("setContent: No helper founded that is supported");
    }

    return await new Promise((done) => setTimeout(done, 5000));
  }

  private catchPhrases = async (msg: ConsoleMessage) => {
    const output = await Promise.all(msg.args().map((j) => j.jsonValue()));
    const flat = output.flat();
    const regex = /^Speak \((.)\) category=(\w+) "(.*)"$/;
    if (flat.length === 1 && flat[0].match(regex)) {
      const [, type, category, text] = flat[0].match(regex) || [];
      if (type === "Q" && this.speakOutput.length) {
        this.speakOutput[this.speakOutput.length - 1].push(text);
      } else {
        this.speakOutput.push([text]);
      }
    }
  };

  async _init() {
    return new Promise(r => setTimeout(r, 5000));
  }

  protected async _before() {
    const context: BrowserContext = this.helpers.Playwright.browser;
    setTimeout(() => {
      const backgroundPage = context.backgroundPages();
      backgroundPage[0]?.on("console", this.catchPhrases);
    }, 1000);
  }

  protected _beforeSuite(suite: Mocha.Suite): void {
    this.speakOutput = [];
  }

  async grabATOutput(locator: CodeceptJS.LocatorOrString) {
    return {
      spoken: this.lastPhrase(),
      output: {
        phrase: this.lastPhrase(),
        phrases: this.speakOutput[this.speakOutput.length - 1],
      },
    };
  }

  private async downChromeVoxModifier() {
    const page: Page = this.helpers.Playwright.page;
    if (platform() === "darwin") {
      await page.keyboard.down("Meta");
      await page.keyboard.down("Control");
    } else {
      await page.keyboard.down("Shift");
      await page.keyboard.down("Alt");
    }
  }
  private async upChromeVoxModifier() {
    const page: Page = this.helpers.Playwright.page;
    if (platform() === "darwin") {
      await page.keyboard.up("Meta");
      await page.keyboard.up("Control");
    } else {
      await page.keyboard.up("Shift");
      await page.keyboard.up("Alt");
    }
  }

  async focus(locator: CodeceptJS.LocatorOrString) {
    return focus(locator, this.helpers);
  }

  async grabFocusedElement() {
    return getFocusedElement(this.helpers);
  }

  async nextItem() {
    const page: Page = this.helpers.Playwright.page;
    await this.downChromeVoxModifier();
    await page.keyboard.press("ArrowDown");
    await this.upChromeVoxModifier();
  }

  async previousItem() {
    const page: Page = this.helpers.Playwright.page;
    await this.downChromeVoxModifier();
    await page.keyboard.press("ArrowUp");
    await this.upChromeVoxModifier();
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

  // async moveRight() {
  //   await this.downChromeVoxModifier();
  //   await this.page.keyboard.press("ArrowRight");
  //   await this.upChromeVoxModifier();
  // }

  // async moveLeft() {
  //   await this.downChromeVoxModifier();
  //   await this.page.keyboard.press("ArrowLeft");
  //   await this.upChromeVoxModifier();
  // }

  // async nextButton() {
  //   await this.downChromeVoxModifier();
  //   await this.page.keyboard.press("N");
  //   await this.page.keyboard.press("B");
  //   await this.upChromeVoxModifier();
  // }
  // async nextTickBox() {
  //   await this.downChromeVoxModifier();
  //   await this.page.keyboard.press("N");
  //   await this.page.keyboard.press("X");
  //   await this.upChromeVoxModifier();
  // }
  // async nextComboBox() {
  //   await this.downChromeVoxModifier();
  //   await this.page.keyboard.press("N");
  //   await this.page.keyboard.press("C");
  //   await this.upChromeVoxModifier();
  // }
  // async nextEditableTextArea() {
  //   await this.downChromeVoxModifier();
  //   await this.page.keyboard.press("N");
  //   await this.page.keyboard.press("E");
  //   await this.upChromeVoxModifier();
  // }

  async nextControlItem() {
    const page: Page = this.helpers.Playwright.page;
    await this.downChromeVoxModifier();
    await page.keyboard.press("N");
    await page.keyboard.press("F");
    await this.upChromeVoxModifier();
  }

  // async nextGraphic() {
  //   await this.downChromeVoxModifier();
  //   await this.page.keyboard.press("N");
  //   await this.page.keyboard.press("G");
  //   await this.upChromeVoxModifier();
  // }
  // async nextHeading() {
  //   await this.downChromeVoxModifier();
  //   await this.page.keyboard.press("N");
  //   await this.page.keyboard.press("H");
  //   await this.upChromeVoxModifier();
  // }

  // async nextLandmark() {
  //   await this.downChromeVoxModifier();
  //   await this.page.keyboard.press("N");
  //   await this.page.keyboard.press("Semicolon");
  //   await this.upChromeVoxModifier();
  // }
  // async nextLink() {
  //   await this.downChromeVoxModifier();
  //   await this.page.keyboard.press("N");
  //   await this.page.keyboard.press("L");
  //   await this.upChromeVoxModifier();
  // }

  // /** E.g. `ol`, `ul`, `[role=list]` */
  // async nextList() {
  //   await this.downChromeVoxModifier();
  //   await this.page.keyboard.press("N");
  //   await this.page.keyboard.press("O");
  //   await this.upChromeVoxModifier();
  // }
  // async nextListItem() {
  //   await this.downChromeVoxModifier();
  //   await this.page.keyboard.press("N");
  //   await this.page.keyboard.press("I");
  //   await this.upChromeVoxModifier();
  // }
  // async nextMath() {
  //   await this.downChromeVoxModifier();
  //   await this.page.keyboard.press("N");
  //   await this.page.keyboard.press("M");
  //   await this.upChromeVoxModifier();
  // }
  // async nextMedia() {
  //   await this.downChromeVoxModifier();
  //   await this.page.keyboard.press("N");
  //   await this.page.keyboard.press("W");
  //   await this.upChromeVoxModifier();
  // }
  // async nextRadioButton() {
  //   await this.downChromeVoxModifier();
  //   await this.page.keyboard.press("N");
  //   await this.page.keyboard.press("R");
  //   await this.upChromeVoxModifier();
  // }
  // async nextTable() {
  //   await this.downChromeVoxModifier();
  //   await this.page.keyboard.press("N");
  //   await this.page.keyboard.press("T");
  //   await this.upChromeVoxModifier();
  // }
  // async nextVisitedLink() {
  //   await this.downChromeVoxModifier();
  //   await this.page.keyboard.press("N");
  //   await this.page.keyboard.press("V");
  //   await this.upChromeVoxModifier();
  // }
}

export = ChromeVox;
