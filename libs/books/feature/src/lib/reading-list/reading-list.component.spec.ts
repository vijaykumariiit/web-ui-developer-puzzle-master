import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedTestingModule } from '@tmo/shared/testing';

import { ReadingListComponent } from './reading-list.component';
import { BooksFeatureModule } from '@tmo/books/feature';
import { removeFromReadingList, markBookAsRead } from '@tmo/books/data-access';
import { createReadingListItem } from '@tmo/shared/testing';
import { Store } from '@ngrx/store';

describe('ReadingListComponent', () => {
  let component: ReadingListComponent;
  let fixture: ComponentFixture<ReadingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, SharedTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('removeFromReadingList should dispatch removeFromReadingList action', () => {
    const item = createReadingListItem('A');
    const action = removeFromReadingList({ item });
    const store = TestBed.inject(Store);
    const spy = jest.spyOn(store, 'dispatch');
    fixture.detectChanges();
    component.removeFromReadingList(item);

    expect(spy).toHaveBeenCalledWith(action);
  });

  it('markBookAsRead should dispatch markBookAsRead action', () => {
    const item = createReadingListItem('A');
    const action = markBookAsRead({ item });
    const store = TestBed.inject(Store);
    const spy = jest.spyOn(store, 'dispatch');
    fixture.detectChanges();
    component.markBookAsRead(item);

    expect(spy).toHaveBeenCalledWith(action);
  });
});
