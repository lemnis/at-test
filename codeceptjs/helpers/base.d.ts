import { Page } from "playwright";

export type AccessibilityNode = Awaited<
  ReturnType<Page["accessibility"]["snapshot"]>
>;

export class ATHelper {
  // Data
  grabATOutput(
    locator?: CodeceptJS.LocatorOrString,
    options?: {
      includeIgnored?: boolean;
      checkCursor?: boolean;
    }
  ): Promise<
    | Partial<
        {
          spoken: string;
          output: {
            phrase: string,
            bounds?: { x: number, y: number, width: number, height: number} | undefined,
            textUnderCursor?: string,
            phrases?: string[] | undefined
          }
        } & AccessibilityNode
      >
    | undefined
  >;
  sayDescription?(): void;

  // Browser Actions
  focus(locator: CodeceptJS.LocatorOrString): Promise<void>;
  grabFocusedElement(): Promise<AccessibilityNode>

  // AT Actions
  nextItem?(): Promise<void>;
  previousItem?(): Promise<void>;

  nextFocusableItem(): Promise<void>;
  previousFocusableItem(): Promise<void>;
  nextControlItem?(): Promise<void>;

  performDefaultAction?(): Promise<void>;

  // nextGraphic(): void;
  // nextHeading(): void;
  // nextLink(): void;
  // nextList(): void;
  // nextTable(): void;
  // nextVisitedLink(): void;
  // nextLandmark(): void;
  [key: string]: any;
}
