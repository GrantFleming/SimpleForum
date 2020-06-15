import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {RegisterComponent} from './register.component';
import {ReactiveFormsModule} from '@angular/forms';
import {AuthenticationService} from '../services/authentication.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {materialStubs} from '../../test_utils/material-test-utils';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {EMPTY, of} from 'rxjs';
import {asyncError} from '../../test_utils/test_async_utils';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockAuthService;
  let mockRouter: Router;
  let mockSnackBar: MatSnackBar;

  beforeEach(async(() => {
    mockAuthService = jasmine.createSpyObj(AuthenticationService, ['registerNewUser', 'isEmailAlreadyTaken']);
    mockRouter = jasmine.createSpyObj(Router, ['navigateByUrl']);
    mockSnackBar = jasmine.createSpyObj(MatSnackBar, ['open']);

    // make registration attempts successful by default, can be overridden by specific tests if need be
    // (successful login attempts 'complete')
    mockAuthService.registerNewUser.and.returnValue(EMPTY);
    // make emails available by default, can be overridden by specific tests if need be
    mockAuthService.isEmailAlreadyTaken.and.returnValue(of(false));

    TestBed.configureTestingModule({
      declarations: [
        RegisterComponent,
        ...materialStubs
      ],
      imports: [ReactiveFormsModule],
      providers: [
        {provide: AuthenticationService, useValue: mockAuthService},
        {provide: Router, useValue: mockRouter},
        {provide: MatSnackBar, useValue: mockSnackBar}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an email, password and confirmation field', () => {
    // in the FormGroup
    const controls = component.registerForm.controls;
    const controlNames = Object.keys(controls);
    expect(controlNames.length).toBe(3);
    expect(controlNames).toContain('email');
    expect(controlNames).toContain('password');
    expect(controlNames).toContain('confirmPassword');

    // and the template linking to the FormGroup
    const inputIDs = fixture.debugElement.queryAll(By.css('input')).map(de => de.attributes.formControlName);
    expect(inputIDs.length).toBe(3);
    expect(inputIDs).toContain('email');
    expect(inputIDs).toContain('password');
    expect(inputIDs).toContain('confirmPassword');
  });

  it('should have a submit button', () => {
    const submitButtonDe = fixture.debugElement.query(By.css('button[type=submit]'));
    expect(submitButtonDe).toBeTruthy();
  });

  it('should initialize the form with empty fields', () => {
    const controls = component.registerForm.controls;
    for (const key of Object.keys(controls)) {
      expect(controls[key].value).toBe('');
    }
  });

  it('should attempt registration on submission when all fields are valid', () => {
    const email = 'someValid@email.com';
    const password = 'someValidPassword';
    const confirmPassword = 'someValidPassword';
    updateForm(email, password, confirmPassword);
    clickSubmitButton();
    expect(mockAuthService.registerNewUser).toHaveBeenCalledWith(email, password);
  });

  it('should disable the submit button if any fields are invalid', () => {
    // invalid email
    updateForm('invalidEmail', 'someValidPassword', 'someValidPassword');
    expect(fixture.debugElement.query(By.css('button[type=submit][disabled]'))).toBeTruthy();

    // no email
    updateForm('', 'someValidPassword', 'someValidPassword');
    expect(fixture.debugElement.query(By.css('button[type=submit][disabled]'))).toBeTruthy();

    // no password
    updateForm('valid@email.com');
    expect(fixture.debugElement.query(By.css('button[type=submit][disabled]'))).toBeTruthy();

    // password mismatch
    updateForm('valid@email.com', 'someValidPassword', 'nonMatchingPassword');
    expect(fixture.debugElement.query(By.css('button[type=submit][disabled]'))).toBeTruthy();

    // email is already taken - WARNING THIS TEST MUST COME LAST WITHIN THIS SPEC!
    mockAuthService.isEmailAlreadyTaken.and.returnValue(of(true));
    updateForm('existing@email.com', 'someValidPassword', 'someValidPassword');
    expect(fixture.debugElement.query(By.css('button[type=submit][disabled]'))).toBeTruthy();
  });

  it('should enable the submit button if all fields are valid', () => {
    updateForm('valid@email.com', 'someValidPassword', 'someValidPassword');
    const buttonDe = fixture.debugElement.query(By.css('button[type=submit]'));
    expect(Object.keys(buttonDe.attributes)).not.toContain('disabled');
  });

  it('should redirect users to the login page on successful registration', () => {
    updateForm('someValid@email.com', 'someValidPassword', 'someValidPassword');
    clickSubmitButton();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/user/login');
  });

  it('should open snackbar warning on unsuccessful registration', fakeAsync(() => {
    mockAuthService.registerNewUser.and.returnValue(asyncError(new Error('some error')));

    updateForm('someValid@email.com', 'someValidPassword', 'someValidPassword');
    clickSubmitButton();
    tick();
    expect(mockSnackBar.open).toHaveBeenCalled();
  }));

  function updateForm(email: string = '', password: string = '', passwordConfirmation: string = '') {
    component.registerForm.controls.email.setValue(email);
    component.registerForm.controls.password.setValue(password);
    component.registerForm.controls.confirmPassword.setValue(passwordConfirmation);
    fixture.detectChanges();
  }

  function clickSubmitButton() {
    const submitButtonDe: DebugElement = fixture.debugElement.query(By.css('button[type=submit]'));
    const submitButtonNe = submitButtonDe.nativeElement;
    submitButtonNe.click();
  }
});
