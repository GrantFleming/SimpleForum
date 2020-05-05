import {Injectable} from '@angular/core';
import {PostService} from './post.service';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Post} from '../models/post';
import {Observable} from 'rxjs';
import {take} from 'rxjs/operators';

/**
 * This resolver retrieves the posts that belong to the forum with the id
 * specified in the route.
 *
 * Although it can be used as per a standard resolver, another use is to
 * use the resolver to ensure that the {@link PostService} cache is hot
 * and ignore the data field that it populates in the route. This often
 * allows the same 'end goal' without adding any additional code to components
 * that use the PostService: if it can reply to a request from the cache it
 * will do so synchronously.
 */
@Injectable({
  providedIn: 'root'
})
export class PostServiceCacheHeater implements Resolve<Post[]> {

  constructor(private postService: PostService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Post[]> {
    const forumId = parseInt(route.paramMap.get('id'), 10);
    return this.postService.getPosts(forumId).pipe(take(1));
  }
}
