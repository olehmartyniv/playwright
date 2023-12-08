import {
  After,
  AfterStep,
  Before,
  BeforeStep,
  Status,
} from '@cucumber/cucumber';
import playwright from 'playwright';
import POManager from '../../pageobjects/POManager.js';

Before(async function () {
  const browser = await playwright.chromium.launch({ headless: false });
  const context = await browser.newContext();
  this.page = await context.newPage();
  this.poManager = new POManager(this.page);
});

After(function () {
  console.log('executed last');
});

BeforeStep({ tags: '@foo' }, function () {
  // This hook will be executed before all steps in a scenario with tag @foo
});

AfterStep(async function ({ result }) {
  if (result.status === Status.FAILED) {
    await this.page.screenshot({ path: 'screenshot_cucumber.png' });
  }
});
