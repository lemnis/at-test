var frontApp, frontAppName, windowTitle;

var systemEvents = Application('System Events');
// var frontApp = systemEvents
// var toolbar

for (const key in systemEvents) {
    console.log(key);
}
// console.log(frontApp);

// set windowTitle to ""
// tell application "System Events"
//     set frontApp to first application process whose frontmost is true
//     set frontAppName to name of frontApp
//     -- tell process frontAppName
//     --     tell (1st window whose value of attribute "AXMain" is true)
//     --         set windowTitle to value of attribute "AXTitle"
//     --     end tell
//     -- end tell
// end tell

// return {frontAppName}