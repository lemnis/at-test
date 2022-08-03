import { Page } from "playwright";

export type AccessibilityNode = Awaited<
  ReturnType<Page["accessibility"]["snapshot"]>
>;

export type Output = Partial<{
  spoken: string;
  output: {
    phrase: string;
    bounds?:
      | { x: number; y: number; width: number; height: number }
      | undefined;
    textUnderCursor?: string;
    phrases?: string[] | undefined;
  };
} & AccessibilityNode>;

export class ATHelper {
  // Data
  grabATOutput(
    locator?: CodeceptJS.LocatorOrString,
    options?: {
      includeIgnored?: boolean;
      checkCursor?: boolean;
    }
  ): Promise<Output | undefined>;
  sayDescription?(): void;

  // Browser Actions
  focus(locator: CodeceptJS.LocatorOrString): Promise<void>;
  grabFocusedElement(): Promise<Output | undefined>;

  // AT Actions
  nextItem?(): Promise<void>;
  previousItem?(): Promise<void>;

  nextFocusableItem(): Promise<void>;
  previousFocusableItem(): Promise<void>;
  nextControlItem?(): Promise<void>;

  performDefaultAction?(): Promise<void>;

  nextGraphicItem?(): void;

  // nextHeading(): void;
  // nextLink(): void;
  // nextList(): void;
  // nextTable(): void;
  // nextVisitedLink(): void;
  // nextLandmark(): void;
  [key: string]: any;
}
