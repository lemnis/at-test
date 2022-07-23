import { VoiceOver, moveRight } from "@accesslint/voiceover";
import { exec } from "child_process";
import { promisify } from "util";
import { join } from "path";
import { NATIVE_WINDOWS } from "./voiceover.constants";
import { KEY_CODES } from "../helpers/voiceover/voiceover.constants";
// import { ATHelper } from "./helpers/base";
// import { focus, getFocusedElement } from "./helpers/browser-actions/focus";
// import { KEY_CODES } from "./helpers/voiceover/voiceover.constants";

const output = codeceptjs.config.get("output");

let lastTimestamp = Date.now();
let resetTimestamp = true;
let previousPhrase: string;
let newestPrase: string;
let interval: any;

export const stopWindowManagment = () => clearInterval(interval);

const navigateBackToBrowser = async (
  voiceOver: VoiceOver,
  phrase: string
) => {
  if (phrase === NATIVE_WINDOWS.DICTATION) {
    voiceOver.advance({ target: { text: "Not Now" }, steps: 10 });
    voiceOver.execute({
      name: "Activate",
      description: "Enter",
      keyCode: KEY_CODES.RETURN,
      modifiers: [],
    });
  }

  // voiceOver
  //         .execute({
  //           name: "Escape",
  //           keyCode: KEY_CODES.ESCAPE,
  //           modifiers: [],
  //         })
  //         //   .then(() =>
  //         //     voiceOver.execute({
  //         //       name: "Move Up",
  //         //       description: "VO+up arrow",
  //         //       keyCode: 126,
  //         //       modifiers: ["control down", "option down"],
  //         //     })
  //         //   )
  //         //   .then(() =>
  //         //     promisify(exec)(
  //         //       `osascript ${__dirname}/voiceover/dismiss-notification.js`
  //         //     ).catch(() => {})
  //         //   )
  //         .then(() => voiceOver.lastPhrase())
  //         .then(
  //           (newPhrase) => {
  //             if (newPhrase === phrase) {
  //               promisify(exec)(
  //                 `osascript  ${__dirname}/voiceover/active-window.scpt`
  //               ).then(
  //                 (window) => {
  //                   console.log("got stuck, exiting", { window });
  //                   process.exit(1);
  //                 },
  //                 () => {
  //                   console.log("got stuck, exiting");
  //                   process.exit(1);
  //                 }
  //               );
  //             } else {
  //               console.log("Got unstuck");
  //               resetTimestamp = true;
  //             }
  //           },
  //           () => {
  //             promisify(exec)(
  //               `osascript  ${__dirname}/voiceover/active-window.scpt`
  //             ).then(
  //               (window) => {
  //                 console.log("got stuck, error!", { window });
  //                 process.exit(1);
  //               },
  //               () => {
  //                 console.log("got stuck, error!");
  //                 process.exit(1);
  //               }
  //             );
  //           }
  //         );
};

export const startWindowManagement = (voiceOver: VoiceOver) => {
  // Start screen recording
  try {
    voiceOver.record({
      file: join(__dirname, "/../", output, `recording.mov`).toString(),
    });
  } catch (error) {}

  interval = setInterval(() => {
    voiceOver.lastPhrase().then((currentPhrase) => {
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
            "/../",
            output,
            `fail-${Date.now()}.png`
          );
          console.log("Took a screenshot at ", file);
          exec(`screencapture ${file}`);
        }
        resetTimestamp = false;

        navigateBackToBrowser(voiceOver, newestPrase);
      }
    });
  });
};
