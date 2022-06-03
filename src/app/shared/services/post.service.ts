import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Post } from '../interfaces/Post';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiURL = 'http://localhost:3000';

  postList!: BehaviorSubject<any>;
  constructor(private httpClient: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  initPost(): Observable<Post[]> {
    if (this.postList) {
      return new Observable<Post[]>((observer) => {
        observer.next(this.postList.getValue());
        observer.complete();
      });
    } else {
      this.postList = new BehaviorSubject([]);
      return this.getAll().pipe(
        tap((data) => {
          this.postList.next(data);
          console.log(this.postList);
        })
      );
    }
  }
  getAll(): Observable<Post[]> {
    return this.httpClient
      .get<Post[]>(this.apiURL + '/posts/')
      .pipe(catchError(this.errorHandler));
  }

  delete(id: number) {
    return this.httpClient
      .delete<Post>(this.apiURL + '/posts/' + id, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  Update(post: Post) {
    return this.httpClient
      .put(this.apiURL + '/posts/', {
        headers: this.headers,
        params: post,
      })
      .pipe(
        map((response: any) => {
          return response.results;
        }),
        catchError(this.errorHandler)
      );
  }
  errorHandler(error: {
    error: { message: string };
    status: any;
    message: any;
  }) {
    console.log(error);
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
