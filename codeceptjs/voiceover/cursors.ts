import { Page, ElementHandle } from "playwright";
import { run } from "@jxa/run";

interface Cursor {
  bounds: { width: number; height: number; x: number; y: number };
  text?: string;
}

export const domCursor = async (
  page: Page,
  element?: ElementHandle
): Promise<Cursor> => {
  const elementBoundingBox = await element?.boundingBox?.();
  const windowOffset = await page.evaluate(() => {
    return {
      x: window.outerWidth - window.innerWidth + window.screenX,
      y: window.outerHeight - window.innerHeight + window.screenY,
    };
  });

  const text = await Promise.race<string | undefined>([
    page.accessibility.snapshot({ root: element }).then((ax) => ax?.name),
    new Promise((r) => setTimeout(() => r(undefined), 3000)),
  ]);

  return {
    bounds: {
      ...elementBoundingBox!,
      x: (elementBoundingBox?.x || 0) + windowOffset.x,
      y: (elementBoundingBox?.y || 0) + windowOffset.y,
    },
    text,
  };
};

export const voCursor = async () => {
  return await run<Cursor>(() => {
    const voiceOver = Application("VoiceOver");
    return {
      bounds: (voiceOver.voCursor as any).bounds(),
      text: (voiceOver.voCursor as any).textUnderCursor(),
    };
  });
};

const RANGE = 1.2;

const compareBounds = (
  a?: { x: number; y: number; height: number; width: number },
  b?: { x: number; y: number; height: number; width: number }
) => {
  // Skip Y coordinate, browser offset is unreliable
  return (
    // Check left
    (a?.x || 0) > (b?.x || 0) - RANGE &&
    // Check right
    (a?.width || 0) + (a?.x || 0) < RANGE + (b?.width || 0) + (a?.x || 0) &&
    // Check height
    (a?.height || 0) < (b?.height || 0) + RANGE
  );
};

export const matchCursors = async (
  helpers: any,
  locator: CodeceptJS.LocatorOrString
) => {
  const playwright: Omit<CodeceptJS.Playwright, "_locate"> &
    Record<string, any> = helpers.Playwright;
  const page: Page = playwright.page;

  const [vo, dom] = await Promise.all([
    voCursor(),
    playwright
      ._locate(locator)
      .then((els: ElementHandle[]) => domCursor(page, els?.[0])),
  ]);

  return (
    (compareBounds(dom.bounds, vo.bounds) ||
      compareBounds(vo.bounds, dom.bounds)) &&
    (!dom.text || !vo.text || vo.text.includes(dom.text))
  );
};
