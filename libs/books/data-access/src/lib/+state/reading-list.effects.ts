import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, exhaustMap, map } from 'rxjs/operators';
import { ReadingListItem } from '@tmo/shared/models';
import * as ReadingListActions from './reading-list.actions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';

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
      concatMap((data) =>
        this.http.post('/api/reading-list', data.book).pipe(
          map(() => {
              if(!data.isUndoAction){
                this.openSnackBar("Book added to Reading list","Undo","undoAdd",data.book);
              }
              return ReadingListActions.confirmedAddToReadingList({ book: data.book })
            }
          ),
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
      concatMap((data) =>
        this.http.delete(`/api/reading-list/${data.item.bookId}`).pipe(
          map(() =>{
            if(!data.isUndoAction){
              this.openSnackBar("Book removed from Reading list","Undo","undoRemove",data.item);
            }
            return ReadingListActions.confirmedRemoveFromReadingList({ item: data.item })
          }
          ),
          catchError((error) =>
            of(ReadingListActions.failedRemoveFromReadingList({ error }))
          )
        )
      )
    )
  );

  ngrxOnInitEffects() {
    return ReadingListActions.init();
  }

  openSnackBar(message: string, action: string, undoAction: string, book) {
    const actionType: string = undoAction;
    const snack = this._snackBar.open(message, action, {
      duration: 5000,
    });
    snack.onAction().subscribe(()=>{
      if(actionType==="undoRemove"){
        this.store.dispatch(ReadingListActions.addToReadingList({ book: book, isUndoAction: true }));
      }else if(actionType==="undoAdd"){
        this.store.dispatch(ReadingListActions.removeFromReadingList({ item: { bookId: book.id , ...book }, isUndoAction: true }));
      }
    })
  }

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private readonly store: Store,
    ) {}
}
