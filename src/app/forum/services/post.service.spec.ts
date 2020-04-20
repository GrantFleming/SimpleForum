import {PostService} from './post.service';
import {Observable} from 'rxjs';
import {Post} from '../models/post';

describe('PostService', () => {
  let service: PostService;
  let mockHttpClient;

  beforeEach(() => {
    mockHttpClient = jasmine.createSpyObj(['get', 'post']);
    mockHttpClient.get.and.returnValue(
      new Observable(
        subscriber =>
          subscriber.next([{id: 1, title: 'A post', body: 'Some text to make up the body of a post'}]
          )));

    service = new PostService(mockHttpClient);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should return empty list on error in getPosts', () => {
    mockHttpClient.get.and.returnValue(
      new Observable(subscriber => subscriber.error('any'))
    );
    service.getPosts().subscribe(value => expect(value).toEqual([]));
  });

  it('should return the same post back on error in addPost', () => {
    // The lack of an id in the returned post is an indication that an error occurred
    mockHttpClient.post.and.returnValue(
      new Observable(subscriber => subscriber.error('any'))
    );
    const post = new Post();
    post.title = 'a title';
    post.body = 'some body text';
    service.addPost(post).subscribe(value => expect(value).toEqual(post));
  });

  it('should not try to add a post that already has an id', () => {
    const post = new Post();
    post.id = 1;
    expect(() => service.addPost(post)).toThrow();
    expect(mockHttpClient.post).toHaveBeenCalledTimes(0);
  });
});
