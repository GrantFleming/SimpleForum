import {AuthenticationService} from './authentication/services/authentication.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {Provider} from '@angular/core';

export const httpInterceptorProviders: Provider[] = [
  {provide: HTTP_INTERCEPTORS, useExisting: AuthenticationService, multi: true}
];
