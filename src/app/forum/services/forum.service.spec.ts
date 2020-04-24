import {fakeAsync, tick} from '@angular/core/testing';

import {ForumService} from './forum.service';
import {HttpHeaders, HttpResponse} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {asyncData} from '../../test_utils/test_async_utils';
import {EMPTY} from 'rxjs';
import {Forum} from '../models/Forum';

describe('ForumService', () => {
  let service: ForumService;
  let mockHttpClient;

  beforeEach(() => {
    mockHttpClient = jasmine.createSpyObj(['get']);
    service = new ForumService(mockHttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

describe('ForumService \'getForums\' method', () => {
  let service: ForumService;
  let mockHttpClient;
  const exampleForums = [
    {
      id: 1,
      name: 'All about cars',
      description: 'All about my favourite cars etc etc etc',
    },
    {
      id: 2,
      name: 'Politics ... raaaaaage',
      description: 'Things that annoy me',
    },
  ];

  const modifiedDate = new Date();
  const responseHeaders = new HttpHeaders().set('Last-Modified', modifiedDate.toUTCString());
  const successfulResponse = new HttpResponse({body: [...exampleForums], headers: responseHeaders, status: 200});

  beforeEach(() => {
    mockHttpClient = jasmine.createSpyObj(['get', 'post']);
    service = new ForumService(mockHttpClient);
  });

  it('should make a valid get request', fakeAsync(() => {
    // valid means to the correct URL with the 'If-Modified-Since' header if applicable

    // if there is not cache yet, 'if-modified-since' header should NOT be in the request:
    mockHttpClient.get.and.returnValue(asyncData(successfulResponse));
    service.getForums().subscribe();
    tick(); // fills the cache as the server response above is emitted
    expect(mockHttpClient.get).toHaveBeenCalledWith(`${environment.backendHost}/forums`, {headers: new HttpHeaders(), observe: 'response'});
    mockHttpClient.get.calls.reset();

    // if there is a cache, 'if-modified-since' header should be the oldest date in the cache
    mockHttpClient.get.and.returnValue(EMPTY);
    service.getForums();
    const expectedHeaders = new HttpHeaders().set('If-Modified-Since', modifiedDate.toUTCString());
    expect(mockHttpClient.get).toHaveBeenCalledWith(`${environment.backendHost}/forums`, {headers: expectedHeaders, observe: 'response'});
  }));

  it('should return forums from server on first call where cache is empty', fakeAsync(() => {
    mockHttpClient.get.and.returnValue(asyncData(successfulResponse));
    let observableHasEmitted = false;
    service.getForums().subscribe(forums => {
        expect(forums).toEqual(exampleForums);
        observableHasEmitted = true;
      },
      () => fail('should not error on trying to get forums'));
    tick();
    expect(observableHasEmitted).toBeTrue();
  }));

  it('should return cached value immediately (synchronously) on second call', fakeAsync(() => {
    mockHttpClient.get.and.returnValue(asyncData(successfulResponse));
    // The first time we call we need to 'tick' as data is fetched from the server
    service.getForums().subscribe();
    tick();

    // The second time an observable should be returned which emits a cached value immediately
    // i.e. without calling tick() in the test here
    let emitted = false;
    service.getForums().subscribe(value => {
      expect(value).toEqual(exampleForums);
      emitted = true;
    });
    expect(emitted).toBeTrue();
  }));

  it('should emit an updated value if it subsequently receives one after responding from cache', fakeAsync(() => {
    mockHttpClient.get.and.returnValue(asyncData(successfulResponse));
    // The first time we call we need to 'tick' as data is fetched from the server
    service.getForums().subscribe();
    tick();

    // The second time an observable should be returned which emits a cached value immediately
    // but will emit an updated value if it receives more up-to-date data
    let valuesReceived = 0;
    service.getForums().subscribe(() => valuesReceived++);
    tick(); // for the server response
    // received the initial value from cache and triggered again when updated data arrived
    expect(valuesReceived).toBe(2);
  }));

  it('should return [] if cache is empty and it receives a non-200 response', fakeAsync(() => {
    mockHttpClient.get.and.returnValue(asyncData(new HttpResponse({status: 304})));
    let emissions = 0;
    let completed = false;
    service.getForums().subscribe(
      val => {
        emissions++;
        expect(val).toEqual([]);
      },
      () => fail('should not error here'),
      () => completed = true);
    tick();
    expect(emissions).toBe(1);
    expect(completed).toBeTrue();
  }));

  it('should not return a further value if it responded from the cache then received a 304', fakeAsync(() => {
    mockHttpClient.get.and.returnValues(
      asyncData(new HttpResponse({body: exampleForums, status: 200})),
      asyncData(new HttpResponse({status: 304})));
    service.getForums().subscribe();
    tick();
    // exampleForums are now in the service's cache
    let emissions = 0;
    let returnedValue: Forum[] = [];
    service.getForums().subscribe(value => {
      emissions++;
      returnedValue = value;
    });
    // cache value should be return synchronously:
    expect(emissions).toBe(1);
    expect(returnedValue).toEqual(exampleForums);

    tick(); // server then responds 304
    // but user already got value from cache so no further value should be emitted
    expect(emissions).toBe(1);
    expect(returnedValue).toEqual(exampleForums);
  }));
});


describe('ForumService \'getForum(forumId)\' method', () => {
  let service: ForumService;
  let mockHttpClient;
  const exampleForums = {
    1: {
      id: 1,
      name: 'All about cars',
      description: 'All about my favourite cars etc etc etc',
    },
    2: {
      id: 2,
      name: 'Politics ... raaaaaage',
      description: 'Things that annoy me',
    }
  };

  const modifiedDate = new Date();
  const responseHeaders = new HttpHeaders().set('Last-Modified', modifiedDate.toUTCString());

  function successfulResponse(forum: Forum) {
    return new HttpResponse({body: forum, headers: responseHeaders, status: 200});
  }

  beforeEach(() => {
    mockHttpClient = jasmine.createSpyObj(['get']);
    service = new ForumService(mockHttpClient);
  });

  it('should make a valid get request', fakeAsync(() => {
    // valid means to the correct URL with the 'If-Modified-Since' header if applicable

    // if there is not cache yet, 'if-modified-since' header should NOT be in the request:
    mockHttpClient.get.and.returnValue(asyncData(successfulResponse(exampleForums['1'])));
    service.getForum(1).subscribe();
    tick(); // fills the cache as the server response above is emitted
    expect(mockHttpClient.get).toHaveBeenCalledWith(
      `${environment.backendHost}/forums/1`,
      {headers: new HttpHeaders(), observe: 'response'});
    mockHttpClient.get.calls.reset();

    // if there is a cache, 'if-modified-since' header should be the oldest date in the cache
    mockHttpClient.get.and.returnValue(EMPTY);
    service.getForum(1);
    const expectedHeaders = new HttpHeaders().set('If-Modified-Since', modifiedDate.toUTCString());
    expect(mockHttpClient.get).toHaveBeenCalledWith(`${environment.backendHost}/forums/1`, {headers: expectedHeaders, observe: 'response'});
  }));

  it('should return the correct forum from server on first call where cache is empty', fakeAsync(() => {
    const forumId = 2;
    const testForum = exampleForums[forumId];
    mockHttpClient.get.and.returnValue(asyncData(successfulResponse(testForum)));
    let observableHasEmitted = false;
    service.getForum(forumId).subscribe(forum => {
        expect(forum).toEqual(testForum);
        observableHasEmitted = true;
      },
      () => fail('should not error on trying to get forums'));
    tick();
    expect(observableHasEmitted).toBeTrue();
  }));

  it('should return cached value immediately (synchronously) on second call', fakeAsync(() => {
    const forumId = 2;
    const testForum = exampleForums[forumId];
    mockHttpClient.get.and.returnValue(asyncData(successfulResponse(testForum)));
    // The first time we call we need to 'tick' as data is fetched from the server
    service.getForum(forumId).subscribe();
    tick();

    // The second time an observable should be returned which emits a cached value immediately
    // i.e. without calling tick() in the test here
    let emitted = false;
    service.getForum(forumId).subscribe(value => {
      expect(value).toEqual(testForum);
      emitted = true;
    });
    expect(emitted).toBeTrue();
  }));

  it('should emit an updated value if it subsequently receives one after responding from cache', fakeAsync(() => {
    const forumId = 2;
    const testForum = exampleForums[forumId];
    mockHttpClient.get.and.returnValue(asyncData(successfulResponse(testForum)));
    // The first time we call we need to 'tick' as data is fetched from the server
    service.getForum(forumId).subscribe();
    tick();

    // The second time an observable should be returned which emits a cached value immediately
    // but will emit an updated value if it receives more up-to-date data
    let valuesReceived = 0;
    service.getForum(forumId).subscribe(() => valuesReceived++);
    tick(); // for the server response
    // received the initial value from cache and triggered again when updated data arrived
    expect(valuesReceived).toBe(2);
  }));

  // got here
  it('should return null if cache is empty and it receives a non-200 response', fakeAsync(() => {
    mockHttpClient.get.and.returnValue(asyncData(new HttpResponse({status: 304})));
    let emissions = 0;
    let completed = false;
    service.getForum(1).subscribe(
      val => {
        emissions++;
        expect(val).toBeNull();
      },
      () => fail('should not error here'),
      () => completed = true);
    tick();
    expect(emissions).toBe(1);
    expect(completed).toBeTrue();
  }));

  it('should not return a further value if it responded from the cache then received a 304', fakeAsync(() => {
    mockHttpClient.get.and.returnValues(
      asyncData(successfulResponse(exampleForums['1'])),
      asyncData(new HttpResponse({status: 304})));
    service.getForum(1).subscribe();
    tick();
    // an example forum is now in the service's cache
    let emissions = 0;
    let returnedValue: Forum = null;
    service.getForum(1).subscribe(value => {
      emissions++;
      returnedValue = value;
    });
    // cache value should be return synchronously:
    expect(emissions).toBe(1);
    expect(returnedValue).toEqual(exampleForums['1']);

    tick(); // server then responds 304
    // but user already got value from cache so no further value should be emitted
    expect(emissions).toBe(1);
    expect(returnedValue).toEqual(exampleForums['1']);
  }));
});


describe('ForumService \'addForum\' method ', () => {

  let service: ForumService;
  let mockHttpClient;

  const exampleForum: Forum = {
    id: undefined,
    name: 'A forum name',
    description: 'The description of a forum'
  };

  function successfulPostResponse(forum: Forum) {
    const responseHeaders = new HttpHeaders().set('Location', `/${forum.id}`);
    return new HttpResponse({headers: responseHeaders, status: 201});
  }

  beforeEach(() => {
    mockHttpClient = jasmine.createSpyObj(['get', 'post']);
    service = new ForumService(mockHttpClient);
  });

  it('should make a valid request', () => {
    // to the correct endpoint with the correct payload
    mockHttpClient.post.and.returnValue(asyncData('any'));
    service.addForum(exampleForum);
    expect(mockHttpClient.post).toHaveBeenCalledWith(`${environment.backendHost}/forums`, exampleForum, jasmine.anything());
  });

  it('should throw an error if the supplied forum already has an id', () => {
    // because an ID can only be allocated by the server
    const invalidForum = Object.assign({}, exampleForum);
    invalidForum.id = 1;
    expect(() => service.addForum(invalidForum)).toThrow();
  });

  it('should get the resource after successful creation and 201 received', fakeAsync(() => {
    const newForumId = 1;
    const returnedForum = Object.assign({}, exampleForum);
    returnedForum.id = newForumId;
    mockHttpClient.post.and.returnValue(asyncData(successfulPostResponse(returnedForum)));
    mockHttpClient.get.withArgs(
      `${environment.backendHost}/forums/${newForumId}`,
      jasmine.anything()
    ).and.returnValue(asyncData(new HttpResponse({body: returnedForum, status: 200})));

    let emissions = 0;
    let completed = false;
    service.addForum(exampleForum).subscribe(
      forum => {
        expect(forum).toEqual(returnedForum);
        emissions++;
      },
      error => fail('should not error: ' + error.message),
      () => completed = true
    );
    tick();
    expect(mockHttpClient.get).toHaveBeenCalledWith(
      `${environment.backendHost}/forums/${newForumId}`,
      jasmine.anything());
    expect(emissions).toBe(1);
    expect(completed).toBeTrue();
  }));

  it('should return null if server returns response other than 201', fakeAsync(() => {
    const headers = new HttpHeaders().set('Location', '/9');
    mockHttpClient.post.and.returnValue(asyncData(new HttpResponse({body: {id: 9}, headers, status: 404})));
    mockHttpClient.get.and.returnValue(asyncData('any'));

    let emissions = 0;
    let completed = false;
    service.addForum(exampleForum).subscribe(
      forum => {
        expect(forum).toBeNull();
        emissions++;
      },
      error => fail('should not error here: ' + error),
      () => completed = true
    );
    tick();
    expect(emissions).toBe(1);
    expect(completed).toBeTrue();
  }));

  it('should cache a successful response', fakeAsync(() => {
    const newForumId = 1;
    const returnedForum = Object.assign({}, exampleForum);
    returnedForum.id = newForumId;
    mockHttpClient.post.and.returnValue(asyncData(successfulPostResponse(returnedForum)));
    mockHttpClient.get.withArgs(
      `${environment.backendHost}/forums/${newForumId}`,
      jasmine.anything()
    ).and.returnValue(asyncData(new HttpResponse({body: returnedForum, status: 200})));

    service.addForum(exampleForum).subscribe();
    tick(); // cache should be populated with response

    // As the new forum should be in the cache now the following should pass
    // synchronously with no need to 'tick'
    let emissions = 0;
    service.getForum(newForumId).subscribe(
      forum => {
        expect(forum).toEqual(returnedForum);
        emissions++;
      },
      () => fail('should not error here')
    );
    expect(emissions).toBe(1);
  }));
});
