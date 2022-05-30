/// <reference path="../../codeceptjs/steps.d.ts" />

import { equal, ok } from "assert";
import snapshot from 'snap-shot-it';

Feature("Details").tag('html/details');

const html = (label?: string, role?: string) => /*html*/ `<details
  id="test"
  ${label ? `aria-label="${label}"` : ''}
  ${role ? `role="${role}"` : ''}
>
  <summary>Summary title</summary>
  Lorem ipsum dolor sit amet.
</details>`;

Scenario("Should not be targetable", async ({ I }) => {
  I.setContent(html());
  equal(await I.grabAXNode("#test"), null);
}).tag('ignored')

Scenario("Should have role", async ({ I }) => {
  I.setContent(html());
  ok(
    ["Details", "details"].includes(
      (await I.grabAXNode("#test", true))?.role!
    )
  );
}).tag('role')

Scenario("Should hide / show content depending on expanded state", async ({ I }) => {
  I.setContent(html());
  let root = await I.grabAXNode();
  snapshot(await I.grabAXNode(undefined, true) as any);
  equal(root?.children?.length, 1);
  I.click('#test')
  root = await I.grabAXNode();
  snapshot(await I.grabAXNode(undefined, true) as any);
  equal(root?.children?.[1].name.trim(), 'Lorem ipsum dolor sit amet.');
}).tag('hideContent')