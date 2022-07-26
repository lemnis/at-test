/// <reference path="../../../codeceptjs/steps.d.ts" />
import { expect } from "../../utils/expect";

const helpers = codeceptjs.config.get("helpers");

(helpers.InternalBrowser ? xFeature : Feature)("aria-describedby").tag(
  "aria/attribute/aria-describedby"
);

const html = `
  <input
    id="target"
    aria-describedby="error"
    type="text"
  >
  <div id="error">error</div>
  <label for="target">Example label</label>
  <script>
    let textInput = document.querySelector('input');
    let error = document.querySelector('#error');

    textInput.addEventListener('keyup', e => {
        error.innerHTML = 'error: ' + e.target.value.length;
    });
  </script>
`;
const htmlWithAlert = `
  <input id="target" aria-describedby="error" type="text">
  <div id="error" role="alert">
    error
  </div>
  <label for="target">Example label</label>
`;

Scenario("contribute to the description", async function (this: any, { I }) {
  I.setContent(html);

  if (helpers.ChromevoxHelper || helpers.VoiceOver) {
    I.focus("#target");
    I.getDescription();
  }

  const ax = await I.grabATOutput("#target");
  expect(ax).to.have.name("error");
}).tag("default");

Scenario(
  "convey description changes when in focus",
  async function (this: any, { I }) {
    I.setContent(html);

    I.focus("#target");
    I.type("Hello");
    I.getDescription();
    expect(await I.grabATOutput("#target")).to.have.name("error: 5");

    I.type(" World");
    I.getDescription();
    expect(await I.grabATOutput("#target")).to.have.name("error: 11");
  }
).tag("changes");

Scenario(
  "contribute to the description with a reference to role='alert'",
  async function (this: any, { I }) {
    I.setContent(htmlWithAlert);

    if (helpers.ChromevoxHelper || helpers.VoiceOver) {
      I.focus("#target");
      I.getDescription();
    }

    const ax = await I.grabATOutput("#target");
    expect(ax).to.have.name("error");
  }
).tag("roleAlert");
