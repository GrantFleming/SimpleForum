import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {EMPTY, Observable} from 'rxjs';
import {ForumService} from './forum.service';
import {catchError, take} from 'rxjs/operators';
import {Forum} from '../models/Forum';

/**
 * This resolver retrieves the forum with the id specified in the route.
 *
 * The resolver is used to ensure that the {@link ForumService} cache is hot
 * so ignore the data field that it populates in the route. This often
 * allows the same 'end goal' without adding any additional code to components
 * that use the ForumService: if it can reply to a request from the cache it
 * will do so synchronously.
 */
@Injectable({
  providedIn: 'root'
})
export class ForumServiceCacheHeater implements Resolve<Forum> {

  constructor(
    private forumService: ForumService,
    private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Forum> {
    const id = parseInt(route.paramMap.get('id'), 10);

    return this.forumService.getForum(id)
      .pipe(
        catchError(() => {
          this.router.navigateByUrl('/page-not-found', {replaceUrl: true});
          return EMPTY;
        }),
        take(1)
      );
  }
}
