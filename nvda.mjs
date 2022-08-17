/**
 * can't get module augmentation to work
 * @type {any}
 */
import expect from "expect";
import path from "path";
import playwright from "playwright";
import {
  awaitNvdaRecording,
  createSpeechRecorder,
} from "screen-reader-testing-library";

async function main() {
  const browserType = "chromium";
  const logFilePath = path.join(path.dirname(""), "nvda-node.log");

  const browser = await playwright[browserType].launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const recorder = createSpeechRecorder(logFilePath);

  expect.extend({
    /**
     * @param {() => Promise<void>} fn
     * @param {string[]} expectedLines
     */
    async toCreateSpeech(fn, expectedLines) {
      // move to end
      await recorder.start();
      await fn();
      const actualLines = await recorder.stop();

      console.log(actualLines)

      return { pass: true };
    },
  });

  await page.goto("https://5f6a0f0de73ecc00085cbbe4--material-ui.netlify.app/");
  // Without bringing it to front the adress bar will still be focused.
  // NVDA wouldn't record any page actions
  await page.bringToFront();
  await awaitNvdaRecording();

  await expect(async () => {
    await page.keyboard.press("s");
  }).toCreateSpeech([
    ["banner landmark"],
    [
      "Search",
      "combo box",
      "expanded",
      "has auto complete",
      "editable",
      "Search…",
      "blank",
    ],
  ]);

  await expect(async () => {
    await page.keyboard.type("Rating");
  }).toCreateSpeech([]);

  await expect(async () => {
    await page.keyboard.press("ArrowDown");
  }).toCreateSpeech([["list"], ["Link to the result", "1 of 5"]]);
  try {
    await run({ browser, logFilePath });
  } finally {
    console.log("teardown");
    return Promise.allSettled([browser.close()]);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(error.code || 1);
});
