/// <reference types='codeceptjs' />

type BaseExtendHelper = import("./base-extend-helper");
type base = typeof import("./helpers/base");
type ATHelper = base['ATHelper'];

declare namespace CodeceptJS {
  interface SupportObject { I: I }
  interface Methods extends WebDriver, Playwright, BaseExtendHelper, InstanceType<ATHelper> {}
  interface I extends Methods {}
  namespace Translation {
    interface Actions {}
  }
}
