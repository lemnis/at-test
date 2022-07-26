export enum BROWSERS {
  CHROMIUM = 'chromium',
  SAFARI = 'safari',
  CHROME = 'chrome',
  WEBKIT = 'webkit',
  FIREFOX = 'firefox',
}

export enum ASSISTIVE_TECHNOLOGY {
  CHROMEVOX = 'ChromeVox',
  VOICEOVER = 'VoiceOver',
  NONE = 'None',
}

export const helpers: {
  Playwright?: CodeceptJS.Playwright & Record<string, any>,
  WebDriver?: CodeceptJS.WebDriver & Record<string, any>,
  VoiceOver?: Record<string, any>,
  ChromeVoxHelper?: Record<string, any>,
} = codeceptjs.config.get("helpers");

export const getDriver = () => {
  return helpers.Playwright ? 'Playwright' : 'WebDriver';
}

export const getBrowserName = (): BROWSERS => {
  return helpers.Playwright?.browser || helpers.WebDriver?.browser;
}

export const getAT = (): ASSISTIVE_TECHNOLOGY => {
  if(helpers.VoiceOver) return ASSISTIVE_TECHNOLOGY.VOICEOVER;
  if(helpers.ChromeVoxHelper) return ASSISTIVE_TECHNOLOGY.CHROMEVOX
  return ASSISTIVE_TECHNOLOGY.NONE;
}