import { VoiceOver, moveRight } from "@accesslint/voiceover";
import { exec } from "child_process";
import { promisify } from "util";
import { join } from "path";
import { NATIVE_WINDOWS } from "./voiceover.constants";
import { KEY_CODES } from "../helpers/voiceover/voiceover.constants";

const VOICEOVER_TIMEOUT = 60000;

const output = codeceptjs.config.get("output");

let lastTimestamp = Date.now();
let resetTimestamp = true;
let previousPhrase: string;
let newestPrase: string;
let interval: any;

console.log({ __dirname, __filename, output });

export const stopWindowManagment = () => clearInterval(interval);

const navigateBackToBrowser = async (voiceOver: VoiceOver, phrase: string) => {
  if (
    phrase.includes(NATIVE_WINDOWS.DICTATION) ||
    phrase.includes(
      "You can configure your microphone in Dictation preferences."
    )
  ) {
    console.log("Warning: Dictaction modal detected, trying to close.");
    await voiceOver.advance({ target: { text: "Not Now" }, steps: 10 });
    await voiceOver.execute({
      name: "Activate",
      description: "Enter",
      keyCode: KEY_CODES.RETURN,
      modifiers: [],
    });
    if ((await voiceOver.lastPhrase()) !== phrase) {
      throw new Error("Got stuck on dictaction");
    }
  } else if (phrase.includes("Notification")) {
    await promisify(exec)(
      `osascript ${__dirname}/dismiss-notification.js`
    ).catch(() => {});
    if ((await voiceOver.lastPhrase()) !== phrase) {
      throw new Error("Got stuck on notification");
    }
  } else {
    throw new Error("Got stuck");
  }
};

export const startWindowManagement = (voiceOver: VoiceOver) => {
  // Start screen recording
  // try {
  //   voiceOver.record({
  //     file: join(
  //       __dirname.replace(output, "").replace("codeceptjs/voiceover", ""),
  //       output,
  //       `recording.mov`
  //     ).toString(),
  //   });
  // } catch (error) {}

  interval = setInterval(() => {
    voiceOver.lastPhrase().then(async (currentPhrase) => {
      if (currentPhrase != newestPrase) {
        // Reset timer on new phrase
        lastTimestamp = Date.now();
        // Move newest phrase to previous phrase
        previousPhrase = newestPrase;
        // Cache latest unique phrase
        newestPrase = currentPhrase;
      }

      if (Date.now() - lastTimestamp > VOICEOVER_TIMEOUT) {
        // Extra screen logging
        if (resetTimestamp) {
          const file = join(
            __dirname.replace(output, "").replace("codeceptjs/voiceover", ""),
            output,
            `fail-${Date.now()}.png`
          );
          console.log("Took a screenshot at ", file);
          await promisify(exec)(`screencapture ${file}`).then(
            console.log,
            console.log
          );
        }
        resetTimestamp = false;

        navigateBackToBrowser(voiceOver, newestPrase);
      }
    });
  });
};
