import { Page } from "playwright";

export const nextFocusableItem = async (helpers: any) => {
  const page: Page = helpers.Playwright.page;
  await page.keyboard.press("Tab");
};

export const previousFocusableItem = async (
  helpers: any
) => {
  const page: Page = helpers.Playwright.page;
  await page.keyboard.down("Shift");
  await page.keyboard.press("Tab");
  await page.keyboard.up("Shift");
};

export const performDefaultAction = async (
  helpers: any
) => {
  const page: Page = helpers.Playwright.page;
  await page.keyboard.press("Enter");
};
