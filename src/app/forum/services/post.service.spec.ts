import {PostService} from './post.service';
import {Post} from '../models/post';
import {HttpHeaders, HttpResponse} from '@angular/common/http';
import {fakeAsync, tick} from '@angular/core/testing';
import {asyncData, asyncError, genericError} from '../../test_utils/test_async_utils';
import {environment} from '../../../environments/environment';
import {defer, EMPTY, of} from 'rxjs';

function anHttpResponse(status: number, body?: any, headers?: HttpHeaders) {
  return new HttpResponse({body, status, headers});
}

describe('PostService', () => {
  let service: PostService;
  let mockHttpClient;

  beforeEach(() => {
    mockHttpClient = jasmine.createSpyObj(['get', 'post']);
    service = new PostService(mockHttpClient);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});

describe('PostService \'getPosts\' method', () => {
  let service: PostService;
  let mockHttpClient;

  const exampleForumId = 3;
  const examplePosts: Post[] = [
    {
      id: null,
      forumId: exampleForumId,
      title: 'post title',
      body: 'post body'
    },
    {
      id: null,
      forumId: exampleForumId,
      title: 'another post title',
      body: 'another post body'
    }
  ];
  beforeEach(() => {
    mockHttpClient = jasmine.createSpyObj(['get']);
    service = new PostService(mockHttpClient);
  });

  it('should make a valid get request', fakeAsync(() => {
    // valid means to the correct URL with the 'If-Modified-Since' header if applicable

    // if there is not cache yet, 'if-modified-since' header should NOT be in the request:
    const creationDate: Date = new Date();
    const headers: HttpHeaders = new HttpHeaders().set('Last-Modified', creationDate.toUTCString());
    mockHttpClient.get.and.returnValue(asyncData(anHttpResponse(200, examplePosts, headers)));
    service.getPosts(exampleForumId).subscribe();
    tick(); // fills the cache as the server response above is emitted
    expect(mockHttpClient.get).toHaveBeenCalledWith(
      `${environment.backendHost}${environment.postsEndpoint}?forumId=${exampleForumId}`,
      {headers: jasmine.anything(), observe: 'response'});
    mockHttpClient.get.calls.reset();

    // if there is a cache, 'if-modified-since' header should be the oldest date in the cache
    mockHttpClient.get.and.returnValue(EMPTY);
    service.getPosts(exampleForumId);
    const expectedHeaders = new HttpHeaders().set('If-Modified-Since', creationDate.toUTCString());
    expect(mockHttpClient.get).toHaveBeenCalledWith(
      `${environment.backendHost}${environment.postsEndpoint}?forumId=${exampleForumId}`,
      {headers: expectedHeaders, observe: 'response'});
  }));

  it('should return empty list on error', fakeAsync(() => {
    mockHttpClient.get.and.returnValue(
      asyncError(genericError)
    );
    // arbitrary choice of forumId
    service.getPosts(1).subscribe(
      value => expect(value).toEqual([]),
      () => fail(' expected empty list on error, not error'));
  }));

  it('should return empty list on 404', fakeAsync(() => {
    mockHttpClient.get.and.returnValue(
      asyncData(anHttpResponse(404))
    );
    let emissions = 0;
    service.getPosts(1).subscribe(
      posts => {
        expect(posts).toEqual([]);
        emissions++;
      },
      () => fail('expected empty list on 404, not error: '));
    tick();
    expect(emissions).toBe(1);
  }));

  it('should pass the forumId in the queryString', () => {
    mockHttpClient.get.and.returnValue(
      of({}) // response doesn't matter
    );
    service.getPosts(666).subscribe();
    expect(mockHttpClient.get).toHaveBeenCalledWith(
      `${environment.backendHost}${environment.postsEndpoint}?forumId=666`, jasmine.anything());
  });

  it('should return posts from server on first call where cache is empty', fakeAsync(() => {
    mockHttpClient.get.and.returnValue(asyncData(anHttpResponse(200, examplePosts)));
    let observableHasEmitted = false;
    service.getPosts(exampleForumId).subscribe(posts => {
        expect(posts).toEqual(examplePosts);
        observableHasEmitted = true;
      },
      () => fail('should not error on trying to get posts'));
    tick();
    expect(observableHasEmitted).toBeTrue();
  }));

  it('should return cached value immediately (synchronously) on second call', fakeAsync(() => {
    const testPosts: Post[] = [
      {
        id: 1,
        forumId: exampleForumId,
        title: 'post title',
        body: 'post body'
      },
      {
        id: 2,
        forumId: exampleForumId,
        title: 'another post title',
        body: 'another post body'
      }
    ];
    mockHttpClient.get.and.returnValue(asyncData(anHttpResponse(200, testPosts)));
    // The first time we call we need to 'tick' as data is fetched from the server
    service.getPosts(exampleForumId).subscribe();
    tick();

    // The second time an observable should be returned which emits a cached value immediately
    // i.e. without calling tick() in the test here
    let emitted = false;
    service.getPosts(exampleForumId).subscribe(value => {
      expect(value).toEqual(testPosts);
      emitted = true;
    });
    expect(emitted).toBeTrue();
  }));

  it('should emit an updated value if it subsequently receives one after responding from cache', fakeAsync(() => {
    mockHttpClient.get.and.returnValue(asyncData(anHttpResponse(200, examplePosts)));
    // The first time we call we need to 'tick' as data is fetched from the server
    service.getPosts(exampleForumId).subscribe();
    tick();

    // The second time an observable should be returned which emits a cached value immediately
    // but will emit an updated value if it receives more up-to-date data
    let valuesReceived = 0;
    service.getPosts(exampleForumId).subscribe(() => valuesReceived++);
    tick(); // for the server response
    // received the initial value from cache and triggered again when updated data arrived
    expect(valuesReceived).toBe(2);
  }));

  it('should not return a further value if it responded from the cache then received a 304', fakeAsync(() => {
    const testPosts: Post[] = [
      {
        id: 1,
        forumId: exampleForumId,
        title: 'post title',
        body: 'post body'
      },
      {
        id: 2,
        forumId: exampleForumId,
        title: 'another post title',
        body: 'another post body'
      }
    ];
    mockHttpClient.get.and.returnValues(
      asyncData(anHttpResponse(200, testPosts)),
      asyncData(anHttpResponse(304)));
    service.getPosts(exampleForumId).subscribe();
    tick();
    // exampleForums are now in the service's cache
    let emissions = 0;
    let returnedValue: Post[] = [];
    service.getPosts(exampleForumId).subscribe(value => {
      emissions++;
      returnedValue = value;
    });
    // cache value should be return synchronously:
    expect(emissions).toBe(1);
    expect(returnedValue).toEqual(testPosts);

    tick(); // server then responds 304
    // but user already got value from cache so no further value should be emitted
    expect(emissions).toBe(1);
    expect(returnedValue).toEqual(testPosts);
  }));
});

describe('PostService \'addPost\' method', () => {
  let service: PostService;
  let mockHttpClient;

  const exampleForumId = 3;
  const examplePost: Post = {
    id: null,
    forumId: exampleForumId,
    title: 'post title',
    body: 'post body'
  };

  beforeEach(() => {
    mockHttpClient = jasmine.createSpyObj(['get', 'post']);
    service = new PostService(mockHttpClient);
  });

  it('should make a valid request', () => {
    // to the correct endpoint with the correct payload
    mockHttpClient.post.and.returnValue(asyncData('any'));
    service.addPost(examplePost);
    expect(mockHttpClient.post).toHaveBeenCalledWith(
      `${environment.backendHost}${environment.postsEndpoint}`, examplePost, jasmine.anything());
  });

  it('should throw error on httpClient error', fakeAsync(() => {
    // The lack of an id in the returned post is an indication that an error occurred
    // this includes a 404 via HttpErrorResponse
    mockHttpClient.post.and.returnValue(
      asyncError(genericError)
    );
    const post = new Post();
    post.title = 'a title';
    post.body = 'some body text';
    service.addPost(post).subscribe(
      () => fail('should not emit here'),
      err => expect(err).toBeInstanceOf(Error));
  }));

  it('should not try to add a post that already has an id', () => {
    const post = new Post();
    post.id = 1;
    expect(() => service.addPost(post)).toThrow();
    expect(mockHttpClient.post).toHaveBeenCalledTimes(0);
  });

  it('should cache the response', fakeAsync(() => {
    // server would assign an id
    const postCopy = Object.assign({}, examplePost);
    postCopy.id = 3;
    mockHttpClient.post.and.returnValue(asyncData(anHttpResponse(201, postCopy)));
    mockHttpClient.get.and.returnValue(defer(() => EMPTY));

    service.addPost(examplePost).subscribe();
    tick(); // HttpClient responds and cache should be updated

    // As the new post should be in the cache now the following should pass
    // synchronously with no need to 'tick'
    let emissions = 0;
    service.getPosts(exampleForumId).subscribe(
      posts => {
        expect(posts).toContain(postCopy);
        emissions++;
      },
      () => fail()
    );
    expect(emissions).toBe(1);
  }));

  it('should return the new resource after successful creation and 201 received', fakeAsync(() => {
    // the server should return the newly created forum in the response body

    const newPostId = 1;
    const returnedPost = Object.assign({id: newPostId}, examplePost);
    mockHttpClient.post.and.returnValue(asyncData(anHttpResponse(201, returnedPost)));

    let emissions = 0;
    service.addPost(examplePost).subscribe(
      post => {
        expect(post).toEqual(returnedPost);
        emissions++;
      },
      error => fail('should not error: ' + error.message)
    );
    tick(); // cache will be empty to tick to get server response
    expect(emissions).toBe(1);
  }));

  it('should return null if server returns response other than 201', fakeAsync(() => {
    mockHttpClient.post.and.returnValue(asyncData(new HttpResponse({status: 400})));

    let emissions = 0;
    service.addPost(examplePost).subscribe(
      post => {
        expect(post).toBeNull();
        emissions++;
      },
      error => fail('should not error here: ' + error)
    );
    tick();
    expect(emissions).toBe(1);
  }));
});
