import { VoiceOver } from "@accesslint/voiceover";

const voiceOver = new VoiceOver();

(async () => {
  await voiceOver.launch(); // start VoiceOver screen reader
  await new Promise((r) => setTimeout(r, 4000));
  console.log(await voiceOver.lastPhrase()); // print last phrase on navigation
  // perform actions using seek, rotor, and execute
  await voiceOver.quit(); // stop VoiceOver
})();
