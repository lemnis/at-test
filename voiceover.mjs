import { VoiceOver } from "@accesslint/voiceover";
import { chromium } from "playwright";

const voiceOver = new VoiceOver();

(async () => {
  const browser = await chromium.launch({
    headless: false,
    waitUntil: "domcontentloaded",
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to Playwright website 🎉
  await page.goto(
    "https://a11ysupport.io/tests/html/aria/aria-placeholder.html"
  );

  await voiceOver.launch();

  await voiceOver.advance({
    target: {
      text: "My birthday MM-DD-YYYY",
      role: "edit text",
    },
    steps: 10,
  });

  console.log(await voiceOver.lastPhrase()); // print last phrase on navigation
  // perform actions using seek, rotor, and execute

  await voiceOver.quit(); // stop VoiceOver
  await browser.close();
})();
