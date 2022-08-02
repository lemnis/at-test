import { platform } from "os";
import { Browser, Page } from "playwright";

const pressKey = async (key: string, helpers: any) => {
  if (helpers.Playwright) {
    const page: Page = helpers.Playwright.page;
    const browser: Browser = helpers.Playwright.browser;
    // TODO: Use safer way to detect webkit
    if ((browser as any)._name === 'webkit' && platform() === "darwin" && key === "Tab") {
      return page.keyboard.press("Alt+Tab");
    } else {
      return page.keyboard.press(key);
    }
  } else if (helpers.WebDriver) {
    const webdriver: CodeceptJS.WebDriver = helpers.WebDriver;
    return webdriver.pressKey(key);
  } else {
    throw new Error("No helper founded that is supported");
  }
};

export const performDefaultAction = (helpers: any) =>
  pressKey("Enter", helpers);

export const nextFocusableItem = (helpers: any) => pressKey("Tab", helpers);

export const previousFocusableItem = async (helpers: any) => {
  if (helpers.Playwright) {
    const page: Page = helpers.Playwright.page;
    await page.keyboard.down("Shift");
    await page.keyboard.press("Tab");
    await page.keyboard.up("Shift");
  } else if (helpers.WebDriver) {
    const webdriver: CodeceptJS.WebDriver = helpers.WebDriver;
    webdriver.pressKey(["Shift", "Tab"]);
  } else {
    throw new Error("No helper founded that is supported");
  }
};
