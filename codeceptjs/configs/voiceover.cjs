const fs = require("fs");
const plist = require("plist");

exports.ATName = "VoiceOver";
exports.ATVersion = plist.parse(fs.readFileSync('/System/Library/CoreServices/VoiceOver.app/Contents/version.plist', 'utf-8'))?.CFBundleVersion;
exports.VoiceOver = {
  require: "../voiceover-helper.ts",
};