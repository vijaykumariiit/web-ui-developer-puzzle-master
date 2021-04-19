import {$, $$, browser, by, element, ExpectedConditions} from 'protractor';
import { expect } from 'chai';

describe('When: I use the reading list feature', () => {
  it('Then: I should see my reading list', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();

    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('[data-testing="reading-list-container"]'),
        'My Reading List'
      )
    );
  });
  it('Then: I should add book to reading list and undo it on snack bar "UNDO" action click', async () => {

    await browser.get('/');
    const form = await $('form');
    const input = await $('input[type="search"]');
    await input.sendKeys('javascript');
    await form.submit();

    const isWantToReadBtnEnabled = await browser.isElementPresent(element(by.css('[data-testing="book-item"] button:not(:disabled)')));
    if (!isWantToReadBtnEnabled) return;

    const readingListBeforeAdd = await $$('.reading-list-item');

    const firstEnabledWantToReadBtn = await $$('[data-testing="book-item"] button:not(:disabled)').first();
    await firstEnabledWantToReadBtn.click();

    const snackBarUndoBtn = await browser.driver.findElement(by.css('.mat-simple-snackbar-action .mat-button'));
    snackBarUndoBtn.click();

    const readingListAfterAdd = await $$('.reading-list-item');
    expect(readingListBeforeAdd.length).to.eqls(readingListAfterAdd.length);
  });
  it('Then: I should remove book from reading list and undo it on snack bar "UNDO" action click', async () => {

    await browser.get('/');

    let readingListBeforeAdd = await $$('.reading-list-item');

    if(readingListBeforeAdd && readingListBeforeAdd.length === 0) {
      const form = await $('form');
      const input = await $('input[type="search"]');
      await input.sendKeys('javascript');
      await form.submit();

      const isWantToReadBtnEnabled = await browser.isElementPresent(element(by.css('[data-testing="book-item"] button:not(:disabled)')));
      if(isWantToReadBtnEnabled) {
        const firstEnabledWantToReadBtn = await $$('[data-testing="book-item"] button:not(:disabled)').first();
        await firstEnabledWantToReadBtn.click();
        readingListBeforeAdd = await $$('.reading-list-item');
      } else return;
    }

    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();

    if(readingListBeforeAdd && readingListBeforeAdd.length === 0) return;

    const readingListRemoveBtn = await $$('.reading-list-item .mat-icon-button ').first();

    readingListRemoveBtn.click();

    const snackBarUndoBtn = await browser.driver.findElement(by.css('.mat-simple-snackbar-action .mat-button'));
    snackBarUndoBtn.click();
    const readingListAfterAdd = await $$('.reading-list-item');
    await $('.mat-drawer-backdrop').click();
    expect(readingListBeforeAdd.length).to.eqls(readingListAfterAdd.length);
  });
  
});
