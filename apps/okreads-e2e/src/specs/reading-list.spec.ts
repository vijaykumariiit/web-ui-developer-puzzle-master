import { $, $$, browser, by, element, ExpectedConditions } from 'protractor';

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

  it('Then: I should able to mark book as finished in reading list', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );
    let readingListBeforeAdd = await $$('.action-btn-holder > button mat-icon.mark-as-unread-color');

    if(readingListBeforeAdd && readingListBeforeAdd.length === 0) {
      const form = await $('form');
      const input = await $('input[type="search"]');
      await input.sendKeys('nodejs');
      await form.submit();

      const isWantToReadBtnEnabled = await browser.isElementPresent(element(by.css('[data-testing="book-item"] button:not(:disabled)')));
      if(isWantToReadBtnEnabled) {
        const firstEnabledWantToReadBtn = await $$('[data-testing="book-item"] button:not(:disabled)').first();
        await firstEnabledWantToReadBtn.click();
        readingListBeforeAdd = await $$('.reading-list-item');
      } else return;
    }

    const readingListBeforeMarkAsRead = await $$('.reading-list-item div.mark-as-read-color')

    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();

    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('[data-testing="reading-list-container"]'),
        'My Reading List'
      )
    );
    
    const markAsReadBtn = await $$('.action-btn-holder > button mat-icon.mark-as-unread-color').first();
    await markAsReadBtn.click();

    const readingListAfterMarkAsRead = await $$('.reading-list-item div.mark-as-read-color');

    expect(readingListAfterMarkAsRead.length).toBeGreaterThan(readingListBeforeMarkAsRead.length);
  });

});
