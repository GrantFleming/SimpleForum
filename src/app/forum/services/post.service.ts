import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {concat, EMPTY, Observable, of} from 'rxjs';
import {Post} from '../models/post';
import {environment} from '../../../environments/environment';
import {catchError, defaultIfEmpty, filter, map, pluck, tap} from 'rxjs/operators';

const cudOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  observe: 'response' as 'response'
};

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private baseURL: string = environment.backendHost;
  private postsEndpoint = '/posts';
  private cache: Map<number, [Post, Date]> = new Map();

  constructor(private http: HttpClient) {
  }

  /**
   *  Returns a list of posts, maybe from the cache maybe from the server,
   *  maybe from the cache then later from the server. The returned Observable
   *  can make a maximum of two emissions.
   *
   *  There are four possible cases this method handles:
   *
   *              | server responds 200   | server responds non-200
   *              | with new data         | and provides no data
   *  ------------|---------------------------------------------------
   *  cache empty | Cache updated         | [] returned on server
   *              | New values returned   | response
   *  ------------|---------------------------------------------------
   *  cache active| Cache value returned  | Cache value returned
   *              | initially ...         |
   *              | Server value returned | Observable completes on
   *              | when it arrives ...   | server response
   *
   * @param forumId the id of the forum for which posts are required
   */
  getPosts(forumId: number): Observable<Post[]> {
    const relevantValues = Array.from(this.cache.values())
      .filter(val => val[0].forumId === forumId);
    const relevantPosts = relevantValues.map(val => val[0]);
    const cachedPosts$ = of(relevantPosts).pipe(
      filter(posts => posts.length !== 0)
    );

    let headers = new HttpHeaders();
    if (relevantValues.length > 0) {
      const dates = relevantValues.map(pair => pair[1].getTime());
      const oldestDate = new Date(Math.min(...dates));
      headers = headers.set('If-Modified-Since', oldestDate.toUTCString());
    }

    const serverResponse$ = this.http.get(
      `${this.baseURL}${this.postsEndpoint}?forumId=${forumId}`,
      {headers, observe: 'response'}
    );

    const updatedPosts$ = serverResponse$.pipe(
      catchError(() => EMPTY),
      filter(response => response.status === 200),
      tap(response => {
        const newPosts = response.body as Post[];
        const lastModified = new Date(response.headers.get('Last-Modified'));
        relevantPosts.forEach(post => this.cache.delete(post.id));
        newPosts.forEach(post => this.cache.set(post.id, [post, lastModified]));
      }),
      pluck('body'),
    );

    return concat(cachedPosts$, updatedPosts$).pipe(defaultIfEmpty([]));
  }

  /**
   * POSTs a new Post to be created on the server and then returns the newly
   * created resource from the body of a 201 response.
   *
   * Returns null on a non-201 response.
   *
   * Throws an error if the newPost parameter has an id as ids can only be
   * issued by the server
   *
   * If a newly created post is returned it is stored in the cache.
   *
   * @param newPost The new forum to be created on the server
   */
  addPost(newPost: Post): Observable<Post> {
    if (newPost.id) {
      throw new Error('Cannot add a forum that contains an ID: ID\'s are added by the server');
    }

    const postRequest$ = this.http.post<Post>(
      `${environment.backendHost}/posts`,
      newPost,
      cudOptions);

    // successful 201 responses result in returning the newly created form
    // other responses elicit a return of null
    return postRequest$.pipe(
      map(response => {
        if (response.status === 201) {
          // on successful response, update the cache and return the value
          this.cache.set(response.body.id, [response.body, new Date(0)]);
          return response.body;
        } else {
          return null;
        }
      }),
      catchError(() => of(null)));
  }
}
