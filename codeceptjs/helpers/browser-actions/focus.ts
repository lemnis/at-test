import { ElementHandle, Page } from "playwright";
import { Browser, Element } from "webdriverio";
import VoiceOver from "../../voiceover-helper";
import { AccessibilityNode } from "../base";

export const focus = async (
  locator: CodeceptJS.LocatorOrString,
  helpers: any
) => {
  if (helpers.Playwright) {
    const elements: ElementHandle[] = await helpers.Playwright._locate(locator);
    return elements[0]?.focus();
  } else if (helpers.WebDriver) {
    const webdriver: CodeceptJS.WebDriver = helpers.WebDriver;
    return webdriver.executeScript(
      (el) => document.querySelector(el).focus(),
      locator
    );
  } else {
    throw new Error("focus: No helper founded that is supported");
  }
};

const findFocusedNode = (node: AccessibilityNode): AccessibilityNode => {
  if (node?.focused) return node;
  for (const child of node?.children || []) {
    const foundNode = findFocusedNode(child);
    if (foundNode) return foundNode;
  }
  return null;
};

export const getFocusedElement = async (helpers: any) => {
  if (helpers.Playwright) {
    const page: Page = helpers.Playwright.page;
    const snapshot = await page.accessibility.snapshot();
    return findFocusedNode(snapshot) || helpers.ChromeVox?.grabATOutput() || undefined;
    // TODO: Grab AX focused element, not the DOM active element
  } else if (helpers.VoiceOver) {
    const voiceOver: VoiceOver = helpers.VoiceOver;
    return await voiceOver.grabATOutput() || undefined;
  } else {
    throw new Error("focus: No helper founded that is supported");
  }
};
