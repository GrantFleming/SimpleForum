import {PostService} from './post.service';
import {Post} from '../models/post';
import {HttpErrorResponse} from '@angular/common/http';
import {fakeAsync} from '@angular/core/testing';
import {asyncError, genericError} from '../../test_utils/test_async_utils';
import {environment} from '../../../environments/environment';
import {of} from 'rxjs';

describe('PostService', () => {
  let service: PostService;
  let mockHttpClient;
  const response404 = new HttpErrorResponse({error: 'test 404 error', status: 404, statusText: 'Not Found'});


  beforeEach(() => {
    mockHttpClient = jasmine.createSpyObj(['get', 'post']);
    service = new PostService(mockHttpClient);
  });


  it('should create', () => {
    expect(service).toBeTruthy();
  });


  it('#getPosts should return empty list on error', fakeAsync(() => {
    mockHttpClient.get.and.returnValue(
      asyncError(genericError)
    );
    // arbitrary choice of forumId
    service.getPosts(1).subscribe(
      value => expect(value).toEqual([]),
      () => fail(' expected empty list on error, not error'));
  }));


  it('#getPosts should return empty list on 404', fakeAsync(() => {
    mockHttpClient.get.and.returnValue(
      asyncError(response404)
    );
    // arbitrary choice of forumId
    service.getPosts(1).subscribe(
      posts => expect(posts).toEqual([]),
      () => fail('expected empty list on 404, not error'));
  }));


  it('#getPosts should pass the forumId in the queryString', () => {
    mockHttpClient.get.and.returnValue(
      of({}) // response doesn't matter
    );
    service.getPosts(666).subscribe();
    expect(mockHttpClient.get).toHaveBeenCalledWith(`${environment.backendHost}/posts?forumId=666`);
  });


  it('#addPost should return the same post back on error', fakeAsync(() => {
    // The lack of an id in the returned post is an indication that an error occurred
    // this includes a 404 via HttpErrorResponse
    mockHttpClient.post.and.returnValue(
      asyncError(genericError)
    );
    const post = new Post();
    post.title = 'a title';
    post.body = 'some body text';
    service.addPost(post).subscribe(
      value => expect(value).toEqual(post),
      () => fail('expected a Post object, not an error'));
  }));


  it('should not try to add a post that already has an id', () => {
    const post = new Post();
    post.id = 1;
    expect(() => service.addPost(post)).toThrow();
    expect(mockHttpClient.post).toHaveBeenCalledTimes(0);
  });
});
