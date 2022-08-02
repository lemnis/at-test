/// <reference path="./steps.d.ts" />

// import { Capabilities } from "@wdio/types/build/Capabilities";
import { Browser, CDPSession, ElementHandle, Page } from "playwright";

function btoa(str: string) {
  return Buffer.from(str, "binary").toString("base64");
}

class BaseExtendHelper extends Helper {
  currentTestTitle?: string;

  protected _before(): void {
    const [test]: [Mocha.Test] = arguments as any;
    this.currentTestTitle = test.title;
  }

  protected _after(): void {
    this.currentTestTitle = undefined;
  }

  async setContent(html: string) {
    if (this.helpers.Playwright) {
      const page: Page = this.helpers.Playwright.page;
      return await page?.setContent(html);
    } else if (this.helpers.WebDriver) {
      const browser: any = this.helpers.WebDriver.browser;
      return await browser.url(
        `data:text/html;base64,${btoa(
          `<title>${this.currentTestTitle || "setContent"}</title>${html}`
        )}`
      );
    } else {
      throw new Error("setContent: No helper founded that is supported");
    }
  }

  async grabRunningInfo() {
    if (this.helpers.Playwright) {
      const browser: Browser = this.helpers.Playwright.browser;
      return {
        name: codeceptjs.config.get("helpers").Playwright.browser,
        driver: "Playwright",
        version: browser?.version(),
      };
    } else if (this.helpers.WebDriver) {
      //   const browser: any = this.helpers.WebDriver.browser;
      //   const capabilities: Capabilities | undefined = browser?.capabilities;
      //   return {
      //     name: codeceptjs.config.get("helpers").WebDriver.browser,
      //     driver: "WebDriver",
      //     version: capabilities?.browserVersion,
      //     platform: capabilities?.platformName,
      //   };
    } else {
      throw new Error("grabRunningInfo: No helper founded that is supported");
    }
  }
}

export = BaseExtendHelper;
