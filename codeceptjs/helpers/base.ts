import { Page } from "playwright";

export type AccessibilityNode = Awaited<ReturnType<Page["accessibility"]["snapshot"]>>;

export interface ATHelper {
  // Data
  grabATOutput(
    locator?: CodeceptJS.LocatorOrString,
    includeIgnored?: boolean
  ): Promise<
    | {
        spoken: string;
      }
    | AccessibilityNode
    | undefined
  >;
  sayDescription?(): void;

  // Browser Actions
  focus(locator: CodeceptJS.LocatorOrString): Promise<void>;

  // AT Actions
  nextItem?(): void;
  previousItem?(): void;

  nextFocusableItem?(): void;
  previousFocusableItem?(): void;
  nextControlItem?(): void;

  performDefaultAction?(): void;

  // nextGraphic(): void;
  // nextHeading(): void;
  // nextLink(): void;
  // nextList(): void;
  // nextTable(): void;
  // nextVisitedLink(): void;
  // nextLandmark(): void;
}
