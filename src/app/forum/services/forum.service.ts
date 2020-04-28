import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {concat, EMPTY, Observable, of} from 'rxjs';
import {Forum} from '../models/Forum';
import {environment} from '../../../environments/environment';
import {defaultIfEmpty, filter, mergeMap, pluck, tap} from 'rxjs/operators';

const cudOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  observe: 'response' as 'response'
};


/**
 * The forum service has the following functionality:
 * - get a list of forums
 * - get a forum with a given id
 * - add a forum
 *
 * The service also keeps a cache to improve performance.
 * Returned observables can emit twice. Immediately from the cache then
 * again later if the server provides a more up-to-date value.
 */
@Injectable({
  providedIn: 'root'
})
export class ForumService {

  /**
   * We store a cache of Forum's along with their
   * 'last modified' timestamp so we know when to
   * replace them
   */
  private cache: Map<number, [Forum, Date]> = new Map();

  constructor(private http: HttpClient) {
  }

  /**
   *  Returns a list of forums, maybe from the cache maybe from the server.
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
   */
  getForums(): Observable<Forum[]> {
    const values = Array.from(this.cache.values());

    // returns the cached forums only if there are forums in the cache
    const $cachedForums = of(values.map(val => val[0]))
      .pipe(
        filter(forums => forums.length !== 0));

    // if the cache is full, use the dates to get the 'If-Modified-Since' header value
    let headers = new HttpHeaders();
    if (values.length > 0) {
      const dates = values.map(pair => pair[1].getTime());
      const oldestDate = new Date(Math.min(...dates));
      headers = headers.set('If-Modified-Since', oldestDate.toUTCString());
    }

    const $serverResponse = this.http.get(
      `${environment.backendHost}/forums`,
      {headers, observe: 'response'});

    // If we are supplied newer forums, update the cache then return them
    const $updatedForums = $serverResponse
      .pipe(
        filter(response => response.status === 200),
        tap(response => {
          const newForums = response.body as Forum[];
          const lastModified = new Date(response.headers.get('Last-Modified'));
          this.cache.clear();
          newForums.forEach(forum => this.cache.set(forum.id, [forum, lastModified]));
        }),
        pluck('body'),
      );

    /*
    If we have not returned anything due to a combination of the cache being empty
    plus the server not being able to provide us with a successful response, return
    an empty forum list.
     */
    return concat($cachedForums, $updatedForums).pipe(defaultIfEmpty([]));
  }

  /**
   *  Returns a Forums, maybe from the cache maybe from the server.
   *
   *  There are four possible cases this method handles:
   *
   *              | server responds 200   | server responds non-200
   *              | with new data         | and provides no data
   *  ------------|---------------------------------------------------
   *  cache does  | Cache updated         | null returned on server
   *  not contain | New values returned   | response
   *  forum w/ id |                       |
   *  ------------|---------------------------------------------------
   *  cache does  | Cache value returned  | Cache value returned
   *  contain     | initially ...         |
   *  forum w/ id | Server value returned | Observable completes on
   *              | when it arrives ...   | server response
   *
   *  @param id The id of the forum the caller is trying to retrieve
   */
  getForum(id: number): Observable<Forum> {
    const cachedValue = this.cache.get(id);

    // returns the cached forum if it exists
    const $cachedForum = cachedValue ? of(cachedValue[0]) : EMPTY;

    // if the cache contains a value for the given id, use the date to get the 'If-Modified-Since' header value
    let headers = new HttpHeaders();
    if (cachedValue) {
      const date = cachedValue[1];
      headers = headers.set('If-Modified-Since', date.toUTCString());
    }

    const $serverResponse = this.http.get(
      `${environment.backendHost}/forums/${id}`,
      {headers, observe: 'response'});

    // If we are supplied a newer forum, update the cache then return it
    const $updatedForum = $serverResponse
      .pipe(
        filter(response => response.status === 200),
        tap(response => {
          const newForum = response.body as Forum;
          const lastModified = new Date(response.headers.get('Last-Modified'));
          this.cache.set(newForum.id, [newForum, lastModified]);
        }),
        pluck('body'),
      );

    /*
    If we have not returned anything due to a combination of the cache being empty
    plus the server not being able to provide us with a successful response, return
    an empty forum list.
     */
    return concat($cachedForum, $updatedForum).pipe(defaultIfEmpty(null));
  }

  /**
   * Posts a new forum to be created on the server and then gets the newly
   * created resource on 201 response. Returns null on a non-201 response.
   *
   * Throws an error if the newForum parameter has an id as ids can only be
   * issued by the server
   *
   * @param newForum The new forum to be created on the server
   */
  addForum(newForum: Forum): Observable<Forum> {
    // ID's are added by the server
    if (newForum.id) {
      throw new Error('Cannot add a forum that contains an ID: ID\'s are added by the server');
    }

    const postRequest$ = this.http.post<Forum>(
      `${environment.backendHost}/forums`,
      newForum,
      cudOptions);

    // successful 201 responses result in getting the newly created forum
    // other responses elicit a return of null
    return postRequest$.pipe(
      mergeMap(response =>
        response.status === 201 ?
          this.getForum(parseInt(response.headers.get('Location').split('/').pop(), 10)) :
          of(null)
      ));
  }
}