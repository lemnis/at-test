import { voiceOver } from "@guidepup/guidepup";

async function run() {
  // Start your screen-reader instance 🎉
  await voiceOver.start();

  // Navigate your environment with screen-readers just as your users do 🏎
  await voiceOver.next();

  // Assert on what your users really see and hear when using screen-readers 👂
  console.log(await voiceOver.lastSpokenPhrase());

  await voiceOver.stop();
}

run();