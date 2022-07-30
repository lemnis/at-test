import "@jxa/global-type";
import { run as jxaRun } from "@jxa/run";
import { exec as execWithCallback } from "child_process";
import { promisify } from "util";

const exec = promisify(execWithCallback);

import { Command, moveRight, rotor } from "@accesslint/voiceover/lib/Commands";
import { KEY_CODES } from "../helpers/voiceover/voiceover.constants";

export class VoiceOverController {
  current?: {
    bounds: { width: number; height: number; x: number; y: number } | undefined;
    textUnderCursor: string | undefined;
    phrases: string[];
    latest: string;
  } = undefined;

  private previous?: {
    bounds: { width: number; height: number; x: number; y: number } | undefined;
    textUnderCursor: string | undefined;
    phrases: string[];
    latest: string;
  } = undefined;

  private timer?: any;
  private log? = false;
  private started?: boolean;
  private stepDelayMs?: number;

  constructor({
    log = false,
    stepDelayMs = 200,
  }: {
    log?: boolean;
    stepDelayMs?: number;
  }) {
    this.log = log;
    this.stepDelayMs = stepDelayMs;
    this.started = false;
  }

  public async launch(): Promise<void> {
    if (this.started) return;

    this.timer = async () => {
      try {
        const output = await this.latestOutput();
        if (
          // Compare VoiceOver cursor
          this.current?.textUnderCursor === output.textUnderCursor &&
          this.current?.bounds?.x === output.bounds?.x &&
          this.current?.bounds?.y === output.bounds?.y &&
          this.current?.bounds?.width === output.bounds?.width &&
          this.current?.bounds?.height === output.bounds?.height
        ) {
          if (
            // Filter out same phrase
            this.current?.latest !== output.phrase
          ) {
            this.current?.phrases.push(output.phrase);
            if (this.current) this.current.latest = output.phrase;
            console.log(this.current);
          }
        } else {
          this.previous = this.current;
          this.current = {
            bounds: output.bounds,
            phrases: [output.phrase],
            textUnderCursor: output.textUnderCursor,
            latest: output.phrase,
          };
          if (this.log) {
            console.log(this.current);
          }
        }
      } catch (error: any) {
        if (error.message.match(/Application isn't running|Command failed/)) {
          return;
        }
        console.error(error);
      }

      if (this.started) {
        setTimeout(this.timer, 300);
      }
    };
    this.timer();

    try {
      await exec(
        "/System/Library/CoreServices/VoiceOver.app/Contents/MacOS/VoiceOverStarter"
      );
      this.started = true;
    } catch (error) {
      console.log(error);
    }
  }

  public async quit(): Promise<void> {
    if (!this.started && !this.timer) return;

    try {
      await jxaRun(() => {
        const voiceOver = Application("VoiceOver");
        voiceOver.quit();
      });
      this.started = false;
      this.timer = undefined;
    } catch (error) {
      console.error(error);
    }
  }

  public async latestOutput(): Promise<{
    phrase: string;
    bounds?: { width: number; height: number; x: number; y: number };
    textUnderCursor?: string;
    phrases?: string[] | undefined;
  }> {
    const phrase = await this.lastPhrase();

    if (!phrase) {
      return await new Promise((r) =>
        setTimeout(() => this.latestOutput().then(r), 100)
      );
    }

    const bounds = await Promise.race([
      jxaRun<{ width: number; height: number; x: number; y: number }>(() => {
        const voiceOver = Application("VoiceOver");
        // @ts-expect-error
        return voiceOver.voCursor.bounds();
      }),
      new Promise<undefined>((r) => setTimeout(() => r(undefined), 8000)),
    ]);

    const textUnderCursor = await Promise.race([
      jxaRun<string>(() => {
        const voiceOver = Application("VoiceOver");
        // @ts-expect-error
        return voiceOver.voCursor.textUnderCursor();
      }),
      new Promise<undefined>((r) => setTimeout(() => r(undefined), 8000)),
    ]);

    return { phrase, bounds, textUnderCursor, phrases: this.current?.phrases };
  }

  public pressKey(
    name: keyof typeof KEY_CODES | string | number,
    modifiers?: string[]
  ): Promise<string> {
    const code = (KEY_CODES as any)[name];
    return jxaRun(
      (code, modifiers) => {
        const systemEvents = Application("System Events");
        systemEvents.keyCode(code, { using: modifiers });
      },
      code || name,
      modifiers
    );
  }

  // -------------------------------

  public async seek({
    text,
    role,
    tries = 10,
  }: {
    text: string;
    role?: string;
    tries?: number;
  }): Promise<string[]> {
    let match = false;
    let count = 0;
    let phrases = [];
    const textRegex = new RegExp(text, "i");

    while (count < tries && !match) {
      await this.execute(moveRight);
      const phrase = await this.lastPhrase();
      phrases.push(phrase);

      if (role) {
        if (phrase.endsWith(` ${role}`) && phrase.match(textRegex)) break;
      } else if (phrase.match(textRegex)) break;

      count++;
    }

    return phrases;
  }

  public lastPhrase(): Promise<string> {
    return jxaRun(() => {
      const voiceOver = Application("VoiceOver");
      // @ts-expect-error
      return voiceOver.lastPhrase.content();
    });
  }

  public async execute(command: Command): Promise<string> {
    await new Promise((r) => setTimeout(() => r(undefined), this.stepDelayMs));
    return await this.pressKey(command.keyCode, command.modifiers);
  }

  public cancel(): Promise<string> {
    return this.pressKey("Escape");
  }

  public async rotor({
    menu,
    find,
  }: {
    menu?: string;
    find?: string;
  } = {}): Promise<void> {
    await this.execute(rotor);

    if (menu) {
      const menuFound = await this.seek({ text: `${menu} menu`, tries: 10 });

      if (find && menuFound) {
        await this.keyStrokes({ text: find, submit: true });
      }
    }
  }

  public async keyStrokes({
    text,
    submit = false,
  }: {
    text: string;
    submit?: boolean;
  }): Promise<void> {
    const letters = text.split("");

    for await (const letter of letters) {
      await new Promise((r) => setTimeout(() => r(undefined), 50));
      await this.pressKey(letter);
    }

    if (submit) {
      await this.pressKey("Return");
    }
  }
}
