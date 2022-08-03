/// <reference path="../../../codeceptjs/steps.d.ts" />
import { expect } from "../../utils/expect";
import snapshot from "snap-shot-it";
import { ASSISTIVE_TECHNOLOGY, getAT } from "../../utils/setup";

xFeature("Alert").tag("aria/role/alert");

const firstAnnouncement =
  "The assertive announcement should interrupt or follow this first announcement.";
const secondAnnouncement =
  "This second announcement should either be skipped or come after the assertive announcement. Polite announcements will always follow the first two.";

const html = /*html*/ `
  <div role="alert" aria-label="important message" id="target-1">Existing content.</div>

  <button id="trigger-1" onclick="testOne()">Test</button>

  <div aria-live="polite" id="first-announcement-text"></div>
  <div aria-live="polite" id="second-announcement-text"></div>

  <p>End of example</p>

  <script>
    var firstAnnouncement = '${firstAnnouncement}';
    var secondAnnouncement = '${secondAnnouncement}';
    var firstAnnouncementDiv = document.querySelector('#first-announcement-text');
    var secondAnnouncementDiv = document.querySelector('#second-announcement-text');

    var announce = function(liveRegion, text) {
      firstAnnouncementDiv.innerText = firstAnnouncement;
      setTimeout(function() {
        secondAnnouncementDiv.innerText = secondAnnouncement;
        setTimeout(function() {
          var span = document.createElement('span');
          span.innerText = text;
          liveRegion.appendChild(span);
          firstAnnouncementDiv.innerText = ''; // clear so that the announcement will happen again
          secondAnnouncementDiv.innerText = ''; // clear so that the announcement will happen again
        }, 1000);
      }, 100);
    };

    var testOne = function() {
      announce(document.querySelector('#target-1'), "I am now populated");
    }
  </script>
`;

Scenario("MUST announce changes to the live region", async ({ I }) => {
  I.setContent(html);

  I.focus("#trigger-1");
  I.performDefaultAction?.();
  I.sayDescription?.();

  const output = await I.grabATOutput("#target-1", { checkCursor: false });

  if (getAT() === ASSISTIVE_TECHNOLOGY.VOICEOVER) {
    const first = output?.output?.phrases ? output.output.phrases.findIndex((phrase) =>
      phrase.includes(firstAnnouncement)
    ) : -1;
    const second = output?.output?.phrases ? output.output.phrases.findIndex((phrase) =>
      phrase.includes(secondAnnouncement)
    ) : -1;
    const alert = output?.output?.phrases ? output.output.phrases.findIndex((phrase) =>
      phrase.includes("Existing content.")
    ) : -1;
    expect(alert).to.be.above(-1);
    console.log({ alert, first, second });
    if (second > -1) expect(second).to.be.above(alert);
    if (first > -1) expect(first).to.be.above(alert);
    if (first > -1 && second > -1) {
      expect(second).to.be.above(first);
    }
  } else {
    expect(output).to.have.name("Existing content.");
  }
}).tag("changes");

Scenario.todo(
  "MUST convey the implicit aria-atomic value of true by announcing the entire region"
);
Scenario.todo(
  "MUST convey the implicit aria-live value of assertive by interrupting the current announcement"
);
Scenario.todo(
  "MAY convey its name and role while navigating the page if it has a name"
);
Scenario.todo(
  "MAY convey its name and role as part of the live announcement if it has a name"
);
