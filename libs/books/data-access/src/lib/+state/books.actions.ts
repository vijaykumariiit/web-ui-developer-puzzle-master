import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { Book } from '@tmo/shared/models';

export const searchBooks = createAction(
  '[Books Search Bar] Search',
  props<{ term: string }>()
);

export const searchBooksSuccess = createAction(
  '[Book Search API] Search success',
  props<{ books: Book[] }>()
);

export const searchBooksFailure = createAction(
  '[Book Search API] Search failure',
  props<{ error: any }>()
);

export const markBookAsFinished = createAction(
  '[Book Search API] Mark book as finished',
  props<{ book: Update<Book> }>()
);

export const markBookAsWantToRead = createAction(
  '[Book Search API] Mark book as want to read',
  props<{ book: Update<Book> }>()
);

export const clearSearch = createAction('[Books Search Bar] Clear Search');
