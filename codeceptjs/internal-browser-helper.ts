/// <reference path="./steps.d.ts" />

// import { Capabilities } from "@wdio/types/build/Capabilities";
import { Browser, CDPSession, ElementHandle, Page } from "playwright";
import { AccessibilityNode, ATHelper } from "./helpers/base";
import { focus, getFocusedElement } from "./helpers/browser-actions/focus";

function btoa(str: string) {
  return Buffer.from(str, "binary").toString("base64");
}

const getAOM = async () => {
  const el = document.querySelector("#test");
  if (!el) return;

  const result: Partial<AccessibilityNode & Record<string, any>> = {};

  // Chrome
  if ((window as any).getComputedAccessibleNode) {
    const ax = await (window as any).getComputedAccessibleNode(el);
    for (const key in ax) {
      if (
        [
          "firstChild",
          "lastChild",
          "parent",
          "previousSibling",
          "nextSibling",
          "ensureUpToDate",
        ].includes(key)
      )
        continue;

      (result as any)[key.toLowerCase()] = ax[key];
    }
    return result;
  } else if ((el as any).accessibleNode) {
    // Firefox
    const ax = await (el as any).accessibleNode;
    for (const key in ax) {
      if (key === "states") {
        // https://hg.mozilla.org/mozilla-central/file/default/accessible/base/States.h
        if (ax[key].includes("unavailable")) result.disabled = true;
        if (ax[key].includes("selected")) result.selected = true;
        if (ax[key].includes("focused")) result.focused = true;
        if (ax[key].includes("pressed")) result.pressed = true;
        if (ax[key].includes("checked")) result.checked = true;
        // if(ax[key].includes('mixed')) r.mixed = true; // mixed for checked or pressed?
        if (ax[key].includes("readonly")) result.readonly = true;
        if (ax[key].includes("expanded")) result.expanded = true;
        if (ax[key].includes("collapsed")) result.expanded = false;
        if (ax[key].includes("busy")) result.busy = true;
        if (ax[key].includes("checkable")) result.checked ??= false;
        if (ax[key].includes("moveable")) result.grabbed ??= false;
        if (ax[key].includes("focusable")) result.focused ??= false;
        if (ax[key].includes("selectable")) result.selected ??= false;
        if (ax[key].includes("multiselectable")) result.multiselectable = true;
        if (ax[key].includes("required")) result.required = true;
        // if (ax[key].includes("invalid")) result.invalid ??= "true"; // missing state for other tokens
        // if(ax[key].includes('haspopup')) r.haspopup ??= true; // missing state for other tokens
        if (ax[key].includes("supports_autocompletion"))
          result.autocomplete = "true";
        if (ax[key].includes("editable")) result.readonly = false;
        if (ax[key].includes("modal")) result.modal = true;
        if (ax[key].includes("multi_line")) result.multiline = true;
        if (ax[key].includes("horizontal")) result.orientation = "horizontal";
        if (ax[key].includes("single_line")) result.multiline = false;
        if (ax[key].includes("vertical")) result.orientation = "vertica";
        if (ax[key].includes("enabled")) result.disabled = false;
        if (ax[key].includes("expandable")) result.expanded ??= false;
      }

      (result as any)[key.toLowerCase()] ??= ax[key];
    }
    return result;
  } else {
    // Safari
    for (const key in el) {
      if (key.startsWith("aria") || key === "role") {
        const k = key.replace("aria", "").toLowerCase();

        if (
          [
            "colcount",
            "colindex",
            "colspan",
            "level",
            "posinset",
            "rowcount",
            "rowindex",
            "rowspan",
            "setsize",
          ].includes(key)
        ) {
          (result as any)[k] = parseInt((el as any)[key]);
        } else if (["busy"].includes(key)) {
          (result as any)[k] =
            (el as any)[key] === "true"
              ? true
              : (el as any)[key] === "false"
              ? false
              : undefined;
        } else {
          (result as any)[key] = (el as any)[key];
        }
      }
    }
  }

  return result;
};

class Accessibility extends Helper implements ATHelper {
  async grabAXNode(
    locator?: CodeceptJS.LocatorOrString,
    includeIgnored = false
  ) {
    if (this.helpers.Playwright) {
      const elements: ElementHandle[] = locator
        ? await this.helpers.Playwright._locate(locator)
        : [];

      if (locator && !elements.length) return undefined;

      const page: Page = this.helpers.Playwright.page;
      return (
        (await page.accessibility.snapshot({
          interestingOnly: !includeIgnored,
          root: elements[0] || undefined,
        })) || undefined
      );
    } else {
      throw new Error("grabAXNode: No helper founded that is supported");
    }
  }

  async grabATOutput(
    locator?: CodeceptJS.LocatorOrString,
    { includeIgnored = false } = {}
  ) {
    return this.grabAXNode(locator, includeIgnored);
  }

  async grabFocusedElement() {
    return getFocusedElement(this.helpers);
  }
  async pressEscape() {}

  async focus(locator: CodeceptJS.LocatorOrString) {
    return focus(locator, this.helpers);
  }
}

export = Accessibility;
