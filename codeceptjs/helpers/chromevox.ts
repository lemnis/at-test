/// <reference path="../steps.d.ts" />

import {
  BrowserContext,
  ConsoleMessage,
  Page,
} from "playwright";
import { ATHelper } from "./base";
import { focus } from "./browser-actions/focus";
import { nextFocusableItem, performDefaultAction, previousFocusableItem } from "./browser-actions/keyboard";

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

class ChromeVoxHelper extends Helper implements ATHelper {
  private speakOutput: any[][] = [];
  private lastPhrase = () => {
    const lastOutputArray = this.speakOutput[this.speakOutput.length - 1];
    return lastOutputArray
      ?.map((i) => i[0])
      .filter(Boolean)
      .join(", ");
  };

  private catchPhrases = (msg: ConsoleMessage) => {
    return Promise.all(msg.args().map((j) => j.jsonValue()))
      .then((i) => i.flat())
      .then((i) => {
        // if (i.length === 2 && i[0].startsWith("Injecting into"))
        if (i.length === 3 && i[1] === 1 && this.speakOutput.length)
          this.speakOutput[this.speakOutput.length - 1].push(i);
        else if (i.length === 3) this.speakOutput.push([i]);
      });
  };

  protected _before(): void {
    const context: BrowserContext = this.helpers.Playwright.browser;
    const backgroundPage = context.backgroundPages();
    setTimeout(() => {
      const backgroundPage = context.backgroundPages();
      backgroundPage[0]?.on("console", this.catchPhrases);
    }, 1000);
  }

  async grabATOutput(locator: CodeceptJS.LocatorOrString) {
    return { spoken: this.lastPhrase() };
  }

  private async downChromeVoxModifier() {
    const page: Page = this.helpers.Playwright.page;
    await page.keyboard.down("Shift");
    await page.keyboard.down("Alt");
  }
  private async upChromeVoxModifier() {
    const page: Page = this.helpers.Playwright.page;
    await page.keyboard.up("Shift");
    await page.keyboard.up("Alt");
  }

  async focus(locator: CodeceptJS.LocatorOrString) {
    return focus(locator, this.helpers.Playwright);
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

export = ChromeVoxHelper;
