### Code Review Points
- empty search should clear search term and set flag loaded=false in store - Fixed
- Unsubscribe from observables subscriptions on destroy of components.(used Async pipe to automatically perform subscribe and unsubscribe operations) - Fixed
- added confirmedAddToReadingList action to add book to the state - Fixed
- added confirmedRemoveFromReadingList action to remove book from the state - Fixed
- addressed missing unit test cases for all functions -Fixed
- For the components which are not dependent on parent component data, no need to trigger change detection cycle when it trigger in parent component. We can do that applying 'onPush' change detection strategy.
- Error handling for no search results

### Accessibility Review Points
#### Automated scan issues 
- Ensures buttons have discernible/lable text
- Ensures the contrast between foreground and background colors meets WCAG 2 AA contrast ratio thresholds

#### Manual testing issues 
- Adding alternative text to images will help Visually impaired users using screen readers will be read an alt attribute to better understand an on-page image. (gave book title as alt text)
- material Badges should be given a meaningful description via matBadgeDescription. This description will be applied, via aria-describedby to the element decorated by matBadge.
- The link for making default search with "javascript" should be focusable and clickable when we hit Enter key
