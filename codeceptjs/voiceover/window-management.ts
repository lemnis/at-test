import { VoiceOver, moveRight } from "@accesslint/voiceover";
import { exec } from "child_process";
import { promisify } from "util";
import { join } from "path";
import { NATIVE_WINDOWS } from "./voiceover.constants";
import { KEY_CODES } from "../helpers/voiceover/voiceover.constants";

const output = codeceptjs.config.get("output");

let lastTimestamp = Date.now();
let resetTimestamp = true;
let previousPhrase: string;
let newestPrase: string;
let interval: any;

export const stopWindowManagment = () => clearInterval(interval);

const navigateBackToBrowser = async (voiceOver: VoiceOver, phrase: string) => {
  if (phrase === NATIVE_WINDOWS.DICTATION) {
    await voiceOver.advance({ target: { text: "Not Now" }, steps: 10 });
    await voiceOver.execute({
      name: "Activate",
      description: "Enter",
      keyCode: KEY_CODES.RETURN,
      modifiers: [],
    });
    if ((await voiceOver.lastPhrase()) !== phrase) {
      process.exit(1);
    }
  } else if (phrase.includes("Notification")) {
    await promisify(exec)(
      `osascript ${__dirname}/dismiss-notification.js`
    ).catch(() => {});
    if ((await voiceOver.lastPhrase()) !== phrase) {
      process.exit(1);
    }
  } else {
    console.log("got stuck, error!");
    process.exit(1);
  }
};

export const startWindowManagement = (voiceOver: VoiceOver) => {
  // Start screen recording
  try {
    voiceOver.record({
      file: join(__dirname, "/../../", output, `recording.mov`).toString(),
    });
  } catch (error) {}

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

      if (Date.now() - lastTimestamp > 10000) {
        // Extra screen logging
        if (resetTimestamp) {
          const file = join(
            __dirname,
            "/../../",
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