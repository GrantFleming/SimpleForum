import {defer, Observable} from 'rxjs';

export const genericError = new Error('any old error');

export function asyncData<T>(data: T): Observable<T> {
  return defer(() => Promise.resolve(data));
}

export function asyncError<T>(error: any) {
  return defer(() => Promise.reject(error));
}
