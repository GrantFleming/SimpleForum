import {AbstractControl, AsyncValidatorFn, FormGroup, ValidatorFn} from '@angular/forms';
import {AuthenticationService} from '../services/authentication.service';
import {map, take} from 'rxjs/operators';

/**
 * Validates that within a FormGroup, the 'password' and 'confirmPassword' fields match.
 *
 * Always returns null (never adds an error to the FormGroup itself) however if they do not
 * match it adds an error to the 'confirmPassword' field.
 */
export const passwordMatchValidator: ValidatorFn = (group: FormGroup) => {
  const password = group.get('password');
  const passwordConfirmation = group.get('confirmPassword');

  const passwordMatch: boolean = password && passwordConfirmation && password.value === passwordConfirmation.value;

  // if the passwords don't match set an error on the password
  // confirmation field only
  if (!passwordMatch) {
    passwordConfirmation.setErrors({passwordMismatch: 'passwords must match'});
  }

  return null;
};

/**
 * Asynchronous validator that emits errors if the server response indicates that
 * an email address is already taken.
 */
export function emailAvailabilityValidator(authService: AuthenticationService): AsyncValidatorFn {
  /**
   * Emits a validation error if the given form control's value is an email which
   * already exists.
   */
  return (control: AbstractControl) => {
    return authService.isEmailAlreadyTaken(control.value).pipe(
      map(taken => taken ? {emailAlreadyTaken: 'this email address is already taken'} : null),
      // defensive programming, async validators MUST complete
      take(1)
    );
  };
}

/**
 * Asynchronous validator that emits errors if the server response indicates that
 * an alias is already taken
 */
export function aliasAvailabilityValidator(authService: AuthenticationService): AsyncValidatorFn {
  /**
   * Emits a validation error if the given form control's value is an email which
   * already exists.
   */
  return (control: AbstractControl) => {
    return authService.isAliasAlreadyTaken(control.value).pipe(
      map(taken => taken ? {aliasAlreadyTaken: 'this alias is already taken'} : null),
      // defensive programming, async validators MUST complete
      take(1)
    );
  };
}
