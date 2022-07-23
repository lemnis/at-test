import { ElementHandle, Page } from "playwright";
import { AccessibilityNode } from "../base";

export const focus = async (
  locator: CodeceptJS.LocatorOrString,
  helpers: any
) => {
  const elements: ElementHandle[] = await helpers.Playwright._locate(locator);
  return elements[0]?.focus();
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
  const page: Page = helpers.Playwright.page;
  const snapshot = await page.accessibility.snapshot();
  return findFocusedNode(snapshot);
};
