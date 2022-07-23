/// <reference path="./steps.d.ts" />
import { VoiceOver, moveRight } from "@accesslint/voiceover";
import { exec } from "child_process";
import { promisify } from "util";
import { ATHelper } from "./helpers/base";
import { focus, getFocusedElement } from "./helpers/browser-actions/focus";
import { KEY_CODES } from "./helpers/voiceover/voiceover.constants";
import {
  nextFocusableItem,
  performDefaultAction,
} from "./helpers/browser-actions/keyboard";

let lastTimestamp = Date.now();
let resetTimestamp = true;
let previousPrase: string;

const voiceOver = new VoiceOver({ log: true });
const logCheck = setInterval(() => {
  voiceOver.lastPhrase().then((phrase) => {
    if (phrase != previousPrase) {
      lastTimestamp = Date.now();
      previousPrase = phrase;
    }

    if (Date.now() - lastTimestamp > 15000) {
      if(resetTimestamp) {
        const now = Date.now();
        console.log(
          "Took a screenshot at ",
          `${__dirname}/../output/voiceover-webkit/fail-${now}.png`
        );
        exec(
          `screencapture ${__dirname}/../output/voiceover-webkit/fail-${now}.png`
        );
      }
      resetTimestamp = false;
      promisify(exec)(
        `osascript  ${__dirname}/voiceover/active-window.scpt`
      ).then(
        (window) => console.log("Stuck on phrase", { phrase, window }),
        () => {
          console.log("got stuck", { phrase });
        }
      );
      voiceOver
        .execute({
          name: "Escape",
          keyCode: 53,
          modifiers: [],
        })
        .then(() =>
          voiceOver.execute({
            name: "Move Up",
            description: "VO+up arrow",
            keyCode: 126,
            modifiers: ["control down", "option down"],
          })
        )
        .then(() =>
          promisify(exec)(
            `osascript ${__dirname}/voiceover/dismiss-notification.js`
          ).catch(() => {})
        )
        .then(() => voiceOver.lastPhrase())
        .then(
          (newPhrase) => {
            if (newPhrase === phrase) {
              promisify(exec)(
                `osascript  ${__dirname}/voiceover/active-window.scpt`
              ).then(
                (window) => {
                  console.log("got stuck, exiting", { window });
                  process.exit(1);
                },
                () => {
                  console.log("got stuck, exiting");
                  process.exit(1);
                }
              );
            } else {
              console.log("Got unstuck");
              resetTimestamp = true;
            }
          },
          () => {
            promisify(exec)(
              `osascript  ${__dirname}/voiceover/active-window.scpt`
            ).then(
              (window) => {
                console.log("got stuck, error!", { window });
                process.exit(1);
              },
              () => {
                console.log("got stuck, error!");
                process.exit(1);
              }
            );
          }
        );
    }
  });
}, 500);

class VoiceOverHelper extends Helper implements ATHelper {
  // protected _beforeSuite(suite: Mocha.Suite): void {
  //   console.log(`Suite: I.${suite.tags}`);
  // }
  // protected _beforeStep(step: CodeceptJS.Step): void {
  //   console.log(`Step: I.${step.name}`);
  // }

  private lastPhrase = async () => {
    return voiceOver.lastPhrase();
  };

  protected async _init() {
    return new Promise((resolve, reject) => {
      voiceOver.launch().then(resolve);
      setTimeout(() => reject("Failed to start"), 5000);
      // voiceOver.record({ file: 'recording.mov' });
    });
  }

  protected async _finishTest() {
    return new Promise((resolve, reject) => {
      voiceOver.quit().then(resolve);
      clearInterval(logCheck);
      setTimeout(() => reject("Failed to start"), 5000);
    });
  }

  async grabATOutput(locator: CodeceptJS.LocatorOrString) {
    return { spoken: await this.lastPhrase() };
  }

  getDescription() {
    // Wait a x of amount of time, till the description is been read
    return new Promise((a) => setTimeout(a, 4000));
  }

  async grabFocusedElement() {
    return getFocusedElement(this.helpers);
  }

  async focus(locator: CodeceptJS.LocatorOrString) {
    return focus(locator, this.helpers);
  }

  async nextItem() {
    await voiceOver.execute(moveRight);
  }

  async nextFocusableItem() {
    return nextFocusableItem(this.helpers);
  }

  async nextControlItem() {
    await voiceOver.execute({
      name: "Move to next form contrl",
      description: "VO+CMD+J",
      keyCode: KEY_CODES.J,
      modifiers: ["control down", "option down", "command"],
    });
  }

  async rotor(...args: Parameters<typeof voiceOver["rotor"]>) {
    await voiceOver.rotor(...args);
  }

  async pressEscape() {
    await voiceOver.execute({
      name: "Escape",
      keyCode: KEY_CODES.ESCAPE,
      modifiers: [],
    });
  }

  async previousItem() {
    await voiceOver.keyStrokes({ text: "ArrowLeft" });
  }

  async performDefaultAction() {
    return performDefaultAction(this.helpers);
  }
}

export = VoiceOverHelper;
