import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedTestingModule } from '@tmo/shared/testing';

import { BooksFeatureModule } from '../books-feature.module';
import { BookSearchComponent } from './book-search.component';
import { Store } from '@ngrx/store';
import {
  addToReadingList,
  clearSearch,
  searchBooks
} from '@tmo/books/data-access';
import { createBook } from '@tmo/shared/testing';

describe('ProductsListComponent', () => {
  let component: BookSearchComponent;
  let fixture: ComponentFixture<BookSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, NoopAnimationsModule, SharedTestingModule],
      providers: [Store]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('formatDate should return formatted date', () => {
    expect(component.formatDate("2015-10-30T00:00:00.000Z")).toEqual("10/30/2015");
  });

  it('searchExample should dispatch searchBooks action with term javascript', () => {
    const action = searchBooks({term: "javascript"});
    const store = TestBed.inject(Store);
    const spy = jest.spyOn(store, 'dispatch');
    fixture.detectChanges();
    component.searchExample();

    expect(spy).toHaveBeenCalledWith(action);
  });

  it('searchBooks should dispatch clearSearch action', () => {
    const action = clearSearch();
    const store = TestBed.inject(Store);
    const spy = jest.spyOn(store, 'dispatch');
    component.searchForm.controls.term.setValue(null);
    fixture.detectChanges();
    component.searchBooks();

    expect(spy).toHaveBeenCalledWith(action);
  });

  it('addBookToReadingList should dispatch addToReadingList action', () => {
    const book = createBook('A');
    const action = addToReadingList({ book });
    const store = TestBed.inject(Store);
    const spy = jest.spyOn(store, 'dispatch');
    fixture.detectChanges();
    component.addBookToReadingList(book);

    expect(spy).toHaveBeenCalledWith(action);
  });

  it('ngOnDestroy should call unsubscribe', () => {
    const spy = spyOn(component['subscription$'], 'unsubscribe');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
});
