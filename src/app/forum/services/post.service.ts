import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Post} from '../models/post';
import {environment} from '../../../environments/environment';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private baseURL: string = environment.backendHost;
  private postsEndpoint = '/posts';

  constructor(private http: HttpClient) {
  }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseURL}${this.postsEndpoint}`)
      .pipe(
        catchError(this.handleError<Post[]>([]))
      );
  }

  addPost(post: Post): Observable<Post> {
    if (post.id) {
      throw new Error('Post cannot already contain an id as this can be overridden by the server.');
    }

    return this.http.post<Post>(`${this.baseURL}${this.postsEndpoint}`, post)
      .pipe(
        catchError(this.handleError<Post>(post))
      );
  }

  /**
   * Handle an error thrown by an observable and instead return an Observable
   * of some default value.
   *
   * TODO - introduce some logging service and log the error
   *
   * @param defaultValue to return
   */
  private handleError<T>(defaultValue?: T) {
    return (error: any): Observable<T> => of(defaultValue as T);
  }
}
