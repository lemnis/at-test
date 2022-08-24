const { chromium } = require("playwright");

const extensionPath =
  "/home/lisa/snap/chromium/common/chromium/Default/Extensions/kgejglhpjiefppelpmljglcjbhoiplfn/53.0.2784.13_0/";

const launchOptions = {
  headless: false,
  args: [`--disable-extensions-except=${extensionPath}`],
};

let promiseResolve;

const speakOutput = [];
const lastPhrase = () => {
  const o = speakOutput[speakOutput.length - 1];
  return o
    ?.map((i) => i[0])
    .filter(Boolean)
    .join(", ");
};

(async () => {
  const context = await chromium.launchPersistentContext("", launchOptions);
  console.log(context.constructor.name);
  const page = await context.newPage();
  await page.setContent(/*html*/ `
    <button id="start" aria-label="start">start</button>
    <time>Native</time>
    <div role="time">ARIA</div>
    <button id="end" aria-label="end">end</button>
  `);

  const backgroundPage = context.backgroundPages()[0];

  backgroundPage.on("console", (msg) => {
    return Promise.all(msg.args().map((j) => j.jsonValue()))
      .then((i) => i.flat())
      .then((i) => {
        if (i.length === 2 && i[0].startsWith("Injecting into"))
          promiseResolve?.();
        if (i.length === 3 && i[1] === 1 && speakOutput.length)
          speakOutput[speakOutput.length - 1].push(i);
        else if (i.length === 3) speakOutput.push([i]);
      });
  });

  await Promise.all([
    page.waitForTimeout(1000),
    new Promise(function (resolve) {
      promiseResolve = resolve;
    }),
    page.waitForLoadState("networkidle"),
  ]);

  await (await page.$("#start")).focus();

  await page.keyboard.down("Shift");
  await page.keyboard.down("Alt");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.up("Shift");
  await page.keyboard.up("Alt");
  console.log(lastPhrase());


  await page.keyboard.down("Shift");
  await page.keyboard.down("Alt");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.up("Shift");
  await page.keyboard.up("Alt");

  console.log(lastPhrase());

  await page.waitForTimeout(1000);
  await context.close();
})();
