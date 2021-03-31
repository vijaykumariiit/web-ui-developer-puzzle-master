import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, exhaustMap, map, switchMap } from 'rxjs/operators';
import { ReadingListItem } from '@tmo/shared/models';
import * as ReadingListActions from './reading-list.actions';
import * as BooksActions from './books.actions';
import { Update } from '@ngrx/entity';
import { Book } from '@tmo/shared/models';

@Injectable()
export class ReadingListEffects implements OnInitEffects {
  loadReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.init),
      exhaustMap(() =>
        this.http.get<ReadingListItem[]>('/api/reading-list').pipe(
          map((data) =>
            ReadingListActions.loadReadingListSuccess({ list: data })
          ),
          catchError((error) =>
            of(ReadingListActions.loadReadingListError({ error }))
          )
        )
      )
    )
  );

  addBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.addToReadingList),
      concatMap(({ book }) =>
        this.http.post('/api/reading-list', book).pipe(
          map(() => ReadingListActions.confirmedAddToReadingList({ book })),
          catchError((error) =>
            of(ReadingListActions.failedAddToReadingList({ error }))
          )
        )
      )
    )
  );

  removeBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.removeFromReadingList),
      concatMap(({ item }) =>
        this.http.delete(`/api/reading-list/${item.bookId}`).pipe(
          switchMap(() =>{
            const bookUpdate: Update<ReadingListItem | Book> = {
              id: item.bookId,
              changes: { finishedDate: null, finished: false }
            };
            return [ReadingListActions.confirmedRemoveFromReadingList({ item }), BooksActions.markBookAsWantToRead({book: bookUpdate})]
           
          }),
          catchError((error) =>
            of(ReadingListActions.failedRemoveFromReadingList({ error }))
          )
        )
      )
    )
  );

  markBookAsRead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.markBookAsRead),
      concatMap(({ item }) =>
        this.http.put(`/api/reading-list/${item.bookId}/finished`,item).pipe(
          switchMap((data: {finishedDate: string}) =>{
            const bookUpdate: Update<ReadingListItem | Book> = {
              id: item.bookId,
              changes: { finishedDate: data.finishedDate, finished: true }
            };
            return [ReadingListActions.confirmedMarkBookAsRead({item: bookUpdate}), BooksActions.markBookAsFinished({book: bookUpdate})]
          }
          ),
          catchError((error) =>
            of(ReadingListActions.failedMarkBookAsRead({ error }))
          )
        )
      )
    )
  );

  ngrxOnInitEffects() {
    return ReadingListActions.init();
  }

  constructor(private actions$: Actions, private http: HttpClient) {}
}
