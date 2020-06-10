import {fakeAsync, TestBed, tick} from '@angular/core/testing';

import {asyncData, asyncError} from '../../test_utils/test_async_utils';
import {HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {EMPTY} from 'rxjs';
import {AuthenticationFailedError, AuthenticationService} from './authentication.service';
import {createUnsecuredToken} from 'jsontokens/lib';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import anything = jasmine.anything;

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: HttpClient, useValue: new HttpClientStub()}
      ]
    });
    service = TestBed.inject(AuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  class HttpClientStub {
  }
});

describe('AuthenticationService\'checkEmailAvailability\' method', () => {

  let mockHttpClient;
  let service: AuthenticationService;

  beforeEach(() => {
    mockHttpClient = jasmine.createSpyObj(['get']);
    service = new AuthenticationService(mockHttpClient);
  });

  it('should return an Observable that emits true if the server responds true', fakeAsync(() => {
    mockHttpClient.get.and.returnValue(asyncData(new HttpResponse({body: true, status: 200})));
    const result$ = service.isEmailAlreadyTaken('some email');
    result$.subscribe(value => expect(value).toBeTrue());
    tick();
  }));

  it('should return an Observable that emits false if the server responds \'false\'', fakeAsync(() => {
    mockHttpClient.get.and.returnValue(asyncData(new HttpResponse({body: false, status: 200})));
    const result$ = service.isEmailAlreadyTaken('some email');
    result$.subscribe(value => expect(value).toBeFalse());
    tick();
  }));

  it('should return an Observable that throws an error if the server responds non-200', fakeAsync(() => {
    mockHttpClient.get.and.returnValue(asyncData(new HttpResponse({status: 400})));
    const result$ = service.isEmailAlreadyTaken('some email');
    result$.subscribe(
      () => fail('Observable should not emit on server error.'),
      error => expect(error).toBeTruthy()
    );
    tick();
  }));

  it('should return an Observable that throws an error if the server responds with body that is not true or false', fakeAsync(() => {
    mockHttpClient.get.and.returnValue(asyncData(new HttpResponse({status: 200, body: 'banana'})));
    const result$ = service.isEmailAlreadyTaken('some email');
    let errorThrown = false;
    result$.subscribe(
      () => fail('Observable should not emit on invalid body.'),
      error => {
        errorThrown = true;
        expect(error).toBeTruthy();
      }
    );
    tick();
    expect(errorThrown).toBeTrue();
  }));

  it('should make the correct http request', () => {
    mockHttpClient.get.and.returnValue(EMPTY);

    const email = 'some email';
    const result$ = service.isEmailAlreadyTaken(email);
    result$.subscribe();
    expect(mockHttpClient.get)
      .toHaveBeenCalledWith(
        `${environment.backendHost}${environment.emailValidationEndpoint}?email=${email}`,
        anything());
  });
});

describe('AuthenticationService login/logout system', () => {

  let mockHttpClient;
  let service: AuthenticationService;

  beforeEach(() => {
    mockHttpClient = jasmine.createSpyObj(['get']);
    service = new AuthenticationService(mockHttpClient);
  });

  it('should initially state that a user is not logged in', () => {
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should generate a request to the correct endpoint', () => {
    mockHttpClient.get.and.returnValue(asyncData('anything'));

    const email = 'someemail';
    const password = 'somepassword';
    service.login(email, password);
    expect(mockHttpClient.get).toHaveBeenCalledWith(
      `${environment.backendHost}${environment.tokenRetrievalEndpoint}`,
      anything());
  });

  it('should generate a request with the correct basic authentication header', () => {
    mockHttpClient.get.and.returnValue(asyncData('anything'));

    const email = 'someemail';
    const password = 'somepassword';
    const basicAuth = btoa(`${email}:${password}`);
    service.login(email, password);
    const options = mockHttpClient.get.calls.mostRecent().args[1];
    expect(options.headers.has('Authorization')).toBeTrue();
    expect(options.headers.get('Authorization')).toContain(`Basic ${basicAuth}`);
  });

  it('should log a valid user in', fakeAsync(() => {
    const token = 'some token';
    mockHttpClient.get.and.returnValue(asyncData(token));
    service.login('valid@user.com', 'correctPassword').subscribe(
      () => fail('This Observable should never emit.'),
      () => fail('This Observable should not throw an error here.'),
      () => {
        const viewablePrivates = service as any;
        expect(viewablePrivates.token).toBe(token);
      }
    );
    tick();
  }));

  it('should state that a user is logged in after successful login', fakeAsync(() => {
    const token = createUnsecuredToken('some token');
    mockHttpClient.get.and.returnValue(asyncData(token));
    service.login('valid@user.com', 'correctPassword').subscribe(
      () => fail('This Observable should never emit.'),
      () => fail('This Observable should not throw an error here.'),
      () => expect(service.isLoggedIn()).toBeTrue()
    );
    tick();
  }));

  it('should state that no user is logged in after unsuccessful login', fakeAsync(() => {
    mockHttpClient.get.and.returnValue(asyncError(new HttpErrorResponse({status: 401})));
    service.login('invalid@user.com', 'incorrectPassword').subscribe(
      () => fail('This Observable should never emit.'),
      () => expect(service.isLoggedIn()).toBeFalse(),
      () => fail('This Observable should not complete.')
    );
    tick();
  }));

  it('should log a user out if a user is logged in', fakeAsync(() => {
    const token = 'some token';
    mockHttpClient.get.and.returnValue(asyncData(new HttpResponse({body: token, status: 200})));
    service.login('valid@user.com', 'correctPassword').subscribe(
      () => fail('This Observable should never emit.'),
      () => fail('This Observable should not throw an error here.'),
      () => {
        service.logout();
        expect(service.isLoggedIn()).toBeFalse();
      }
    );
    tick();
  }));

  it('should throw no errors logging out if no user is logged in', () => {
    expect(service.isLoggedIn()).toBeFalse();
    service.logout();
  });

  it('should throw an Error if a login results in a 401 response', fakeAsync(() => {
    mockHttpClient.get.and.returnValue(asyncError(new HttpErrorResponse({status: 401})));
    service.login('invalid@user.com', 'incorrectPassword').subscribe(
      () => fail('This Observable should never emit.'),
      e => {
        expect(e).toBeInstanceOf(AuthenticationFailedError);
      },
      () => fail('This Observable should not complete here.')
    );
    tick();
  }));

  it('should throw an Error on a non 200 response', fakeAsync(() => {
    mockHttpClient.get.and.returnValue(asyncError(new HttpErrorResponse({status: 500})));
    service.login('some@user.com', 'somePassword').subscribe(
      () => fail('This Observable should never emit.'),
      e => expect(e).toBeInstanceOf(Error),
      () => fail('This Observable should not complete here.')
    );
    tick();
  }));

  it('should state a user is not logged in if their token has expired', () => {
    const expiryDateInPast = new Date().getTime() / 1000 - 1;
    (service as any).token = createUnsecuredToken({exp: expiryDateInPast});
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should state a user is logged in if their token has not expired', () => {
    const expiryDateInFuture = new Date().getTime() / 1000 + 1;
    (service as any).token = createUnsecuredToken({exp: expiryDateInFuture});
    expect(service.isLoggedIn()).toBeTrue();
  });
});

describe('AuthenticationService \'registerNewUser\' method', () => {

  let mockHttpClient;
  let service: AuthenticationService;

  beforeEach(() => {
    mockHttpClient = jasmine.createSpyObj(['get', 'post']);
    service = new AuthenticationService(mockHttpClient);
  });

  it('should formulate the correct http request', () => {
    mockHttpClient.post.and.returnValue(asyncData(new HttpResponse({status: 201})));

    const email = 'some email';
    const password = 'some password';
    service.registerNewUser(email, password).subscribe();

    // to the correct URL
    expect(mockHttpClient.post).toHaveBeenCalledWith(
      `${environment.backendHost}${environment.userRegistrationEndpoint}`,
      anything(),
      anything());

    const body = mockHttpClient.post.calls.mostRecent().args[1];
    expect(body).toContain(`email=${email}&password=${password}`);

    const options = mockHttpClient.post.calls.mostRecent().args[2];
    const headers = options.headers;
    expect(headers.has('Content-Type')).toBeTrue();
    expect(headers.get('Content-Type')).toContain('application/x-www-form-urlencoded');
  });

  it('should complete successfully on 201 response', () => fakeAsync(() => {
    mockHttpClient.post.and.returnValue(asyncData(new HttpResponse({status: 201})));

    let complete = false;
    service.registerNewUser('someemail', 'somepassword').subscribe(
      () => fail('Observable should never emit.'),
      () => fail('Observable should not error here.'),
      () => complete = true
    );

    tick();
    expect(complete).toBeTrue();
  }));

  it('should throw AuthenticationError on 400 response', fakeAsync(() => {
    mockHttpClient.post.and.returnValue(asyncError(new HttpErrorResponse({status: 400})));

    service.registerNewUser('someemail', 'somepassword').subscribe(
      () => fail('Observable should never emit.'),
      err => expect(err).toBeInstanceOf(AuthenticationFailedError),
      () => fail('Observable should not complete here')
    );

    tick();
  }));

  it('should throw AuthenticationError on 500 response', fakeAsync(() => {
    mockHttpClient.post.and.returnValue(asyncError(new HttpErrorResponse({status: 500})));

    service.registerNewUser('someemail', 'somepassword').subscribe(
      () => fail('Observable should never emit.'),
      err => expect(err).toBeInstanceOf(AuthenticationFailedError),
      () => fail('Observable should not complete here')
    );

    tick();
  }));
});

describe('AuthenticationService as HttpInterceptor', () => {

  let service: AuthenticationService;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthenticationService,
        {provide: HTTP_INTERCEPTORS, useExisting: AuthenticationService, multi: true}
      ]
    });

    service = TestBed.inject(AuthenticationService);
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should add an authorization header if the user is logged in', () => {
    spyOn(service, 'isLoggedIn').and.returnValue(true);
    httpClient.get('/some/url').subscribe(
      value => expect(value).toBeTruthy()
    );
    const request = httpMock.expectOne('/some/url').request;
    expect(request.headers.has('Authorization')).toBeTrue();
  });

  it('should not add an authorization header if no user is logged in', () => {
    spyOn(service, 'isLoggedIn').and.returnValue(false);
    httpClient.get('/some/url').subscribe(
      value => expect(value).toBeTruthy()
    );
    const request = httpMock.expectOne('/some/url').request;
    expect(request.headers.has('Authorization')).toBeFalse();
  });

  it('should add the correct token', () => {
    const token = 'some token';
    spyOn(service, 'isLoggedIn').and.returnValue(true);
    (service as any).token = token;
    httpClient.get('/some/url').subscribe(
      value => expect(value).toBeTruthy()
    );
    const request = httpMock.expectOne('/some/url').request;
    expect(request.headers.get('Authorization')).toContain(token);
  });

  it('should not alter the request apart from adding the authorization header', () => {
    const url = '/some/url';
    const body = 'some body data';

    spyOn(service, 'isLoggedIn').and.returnValue(true);
    httpClient.post(url, body, {headers: new HttpHeaders({something: 'anything'})}).subscribe(
      value => expect(value).toBeTruthy()
    );
    const request = httpMock.expectOne(url).request;
    expect(request.headers.get('something')).toEqual('anything');
    expect(request.headers.keys().length).toBe(2); // our custom header plus authorization header, nothing else added

    expect(request.method).toEqual('POST');
    expect(request.url).toEqual(url);
    expect(request.body).toEqual(body);
  });

});

