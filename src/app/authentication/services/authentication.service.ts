import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {catchError, ignoreElements, map, tap} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';


/**
 * Thrown on failure to login, either due to incorrect credentials
 * or to server error.
 */
export class AuthenticationFailedError extends Error {
  constructor(message: string) {
    super(message);
  }
}

/**
 * Manages user state and log-in logic.
 *
 * AuthenticationService is also an HttpInterceptor that will add appropriate authorization
 * headers to outgoing requests if a user is logged in.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements HttpInterceptor {

  private token: string;
  private loginURL = `${environment.backendHost}${environment.tokenRetrievalEndpoint}`;
  private registrationURL = `${environment.backendHost}${environment.userRegistrationEndpoint}`;
  private emailValidationURL = `${environment.backendHost}${environment.emailValidationEndpoint}`;
  private jwtHelperService = new JwtHelperService();

  constructor(private httpClient: HttpClient) {
  }

  /**
   * Returns true if a user is currently logged in (the service is in
   * possession of a non-expired token) otherwise false.
   */
  isLoggedIn(): boolean {
    return (this.token !== undefined && !this.jwtHelperService.isTokenExpired(this.token));
  }

  /**
   * Attempts registration of a new user. Returned observable completes on successful
   * registration or throws an error if the registration is unsuccessful.
   *
   * Unsuccessful registration could be caused by a failure to communicate with the
   * server, or an error response from the server.
   *
   * @param email of the new user
   * @param password of the new user
   */
  registerNewUser(email: string, password: string): Observable<never> {
    const headers = new HttpHeaders().append('Content-Type', 'application/x-www-form-urlencoded');
    const body = `email=${email}&password=${password}`;

    const request$ = this.httpClient.post(this.registrationURL, body, {headers});
    return request$.pipe(
      catchError(err => {
        throw new AuthenticationFailedError(err.message);
      }),
      ignoreElements()
    );
  }

  /**
   * Checks whither a given email address has already been taken by a user or not.
   *
   * Returned observable emits true if the email is ALREADY TAKEN
   *
   * @param email to check for availability
   */
  isEmailAlreadyTaken(email: string): Observable<boolean> {
    const url = `${this.emailValidationURL}?email=${email}`;
    return this.httpClient.get(url, {observe: 'response'})
      .pipe(
        // throw error if response status is not 200 otherwise get and trim the body
        map(response => {
          if (response.status !== 200) {
            throw new Error('Non-200 status from server.');
          } else if (typeof response.body !== 'boolean') {
            throw new Error('Could not understand server response, ' +
              'expected a boolean and instead got a ' + typeof response.body);
          }
          return response.body;
        })
      );
  }

  /**
   * Attempts to log a user in. Returned Observable completes on successful login
   * (indicating that a token was successfully retrieved from the server) or throws
   * an error if the login was unsuccessful.
   *
   * Unsuccessful login could be caused by a failure to communicate with the server
   * or an error response from the server.
   *
   * @param email of the user that wishes to log in
   * @param password of the user that wishes to log in
   */
  login(email: string, password: string): Observable<never> {
    const basicAuth = btoa(`${email}:${password}`);
    const headers = new HttpHeaders().append('Authorization', `Basic ${basicAuth}`);

    const request$ = this.httpClient.get(this.loginURL, {headers, observe: 'body', responseType: 'text'});

    // We make sure to not leak details of the token to the outside world by ignoring
    // emissions. An observable is still returned as the user should be able to provide
    // a callback to process after login, here they can subscribe and provide a callback
    // to be executed on completion rather than emission.
    return request$.pipe(
      // hide dirty HTTP request details, there was an error authenticating.
      catchError(err => {
        if (err instanceof HttpErrorResponse && (err as HttpErrorResponse).status === 401) {
          throw new AuthenticationFailedError(err.message);
        }
        throw new Error('Error occurred during authentication.');
      }),
      tap(x => this.token = x),
      ignoreElements()
    );
  }

  /**
   * Logs the user out (deletes the held token if one exists)
   */
  logout() {
    this.token = undefined;
  }

  /**
   * If a user is logged in, this methods adds authentication to all http requests.
   *
   * @param req outgoing request which may need authentication
   * @param next the next handler in the chain
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.isLoggedIn()) {
      const headers = req.headers.append('Authorization', `Bearer ${this.token}`);
      const authenticatedRequest = req.clone({headers});
      return next.handle(authenticatedRequest);
    }
    return next.handle(req);
  }

}
