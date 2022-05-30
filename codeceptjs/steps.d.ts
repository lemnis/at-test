/// <reference types='codeceptjs' />

type CustomHelper = import("./a11y-helper");

declare namespace CodeceptJS {
  interface SupportObject { I: I }
  interface Methods extends WebDriver, Playwright, CustomHelper {}
  interface I extends Methods {}
  namespace Translation {
    interface Actions {}
  }
}
