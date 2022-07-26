import { writeFileSync } from 'fs';

const newFile = `const standardActingHelpers = [
  'Playwright',
  'WebDriver',
  'Puppeteer',
  'Appium',
  'TestCafe',
  'Protractor',
  'Nightmare',
  'VoiceOverHelper'
];

module.exports = standardActingHelpers;`;

const write = writeFileSync('./node_modules/codeceptjs/lib/plugin/standardActingHelpers.js', newFile);
console.log(write || 'Updated file');