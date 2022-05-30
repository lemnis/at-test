/// <reference path="../../codeceptjs/steps.d.ts" />

import { equal, ok } from "assert";
const snapshot = require('snap-shot-it')

Feature("Document").tag("api/Document");

const html = () => /*html*/ `<h1>Hello World</h1>`;

Scenario.todo("readonly should reflect designMode", async ({ I }) => {
  I.setContent(html());
  I.executeScript(() => {
      document.designMode = "on";
  })

  console.log(await I.grabAXNode(), true);
}).tag("readonly");
