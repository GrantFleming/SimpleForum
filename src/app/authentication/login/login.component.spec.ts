import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {LoginComponent} from './login.component';
import {ReactiveFormsModule} from '@angular/forms';
import {AuthenticationFailedError, AuthenticationService} from '../services/authentication.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {EMPTY} from 'rxjs';
import {materialStubs} from '../../test_utils/material-test-utils';
import {asyncError} from '../../test_utils/test_async_utils';
import anything = jasmine.anything;

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService;
  let mockRouter: Router;
  let mockSnackBar: MatSnackBar;

  beforeEach(async(() => {
    mockAuthService = jasmine.createSpyObj(AuthenticationService, ['login']);
    mockRouter = jasmine.createSpyObj(Router, ['navigateByUrl']);
    mockSnackBar = jasmine.createSpyObj(MatSnackBar, ['open']);

    // make authentication attempts successful by default, can be overridden by specific tests if need be
    // (successful login attempts 'complete')
    mockAuthService.login.and.returnValue(EMPTY);

    TestBed.configureTestingModule({
      declarations: [
        LoginComponent,
        ...materialStubs
      ],
      imports: [
        ReactiveFormsModule,
      ],
      providers: [
        {provide: AuthenticationService, useValue: mockAuthService},
        {provide: Router, useValue: mockRouter},
        {provide: MatSnackBar, useValue: mockSnackBar}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a username and password field', () => {
    // in the FormGroup
    const controls = component.loginForm.controls;
    const controlNames = Object.keys(controls);
    expect(controlNames.length).toBe(2);
    expect(controlNames).toContain('email');
    expect(controlNames).toContain('password');

    // and the template linking to the FormGroup
    const inputIDs = fixture.debugElement.queryAll(By.css('input')).map(de => de.attributes.formControlName);
    expect(inputIDs.length).toBe(2);
    expect(inputIDs).toContain('email');
    expect(inputIDs).toContain('password');

  });

  it('should have a submit button', () => {
    const submitButtonDe = fixture.debugElement.query(By.css('button[type=submit]'));
    expect(submitButtonDe).toBeTruthy();
  });

  it('should initialize the form with empty fields', () => {
    const controls = component.loginForm.controls;
    for (const key of Object.keys(controls)) {
      expect(controls[key].value).toBe('');
    }
  });

  it('should attempt login on submission when all fields are valid', () => {
    const email = 'someValid@email.com';
    const password = 'someValidPassword';
    updateForm(email, password);
    clickSubmitButton();
    expect(mockAuthService.login).toHaveBeenCalledWith(email, password);
  });

  it('should have a non-disabled submit button if all fields are valid', () => {
    updateForm('valid@email.com', 'someValidPassword');
    const buttonDe = fixture.debugElement.query(By.css('button[type=submit]'));
    expect(Object.keys(buttonDe.attributes)).not.toContain('disabled');
  });

  it('should have a disabled submit button if any fields are invalid', () => {
    updateForm('invalidEmail', 'someValidPassword');
    expect(fixture.debugElement.query(By.css('button[type=submit][disabled]'))).toBeTruthy();

    updateForm('', 'someValidPassword');
    expect(fixture.debugElement.query(By.css('button[type=submit][disabled]'))).toBeTruthy();

    updateForm('valid@email.com', '');
    expect(fixture.debugElement.query(By.css('button[type=submit][disabled]'))).toBeTruthy();
  });

  it('should redirect to the forum-explorer on successful login', () => {
    updateForm('someValid@email.com', 'someValidPassword');
    clickSubmitButton();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/forums');
  });

  it('should open a snackbar warning on unsuccessful login attempt (generic error)', fakeAsync(() => {
    mockAuthService.login.and.returnValue(asyncError(new Error('some error')));

    updateForm('some@email.com', 'somePassword');
    clickSubmitButton();
    tick();
    expect(mockSnackBar.open).toHaveBeenCalled();
    expect(mockSnackBar.open).toHaveBeenCalledWith((component as any).unknownErrorMessage, anything(), anything());
  }));

  it('should open a snackbar warning on unsuccessful login attempt (authentication failure)', fakeAsync(() => {
    mockAuthService.login.and.returnValue(asyncError(new AuthenticationFailedError('some error')));

    updateForm('some@email.com', 'somePassword');
    clickSubmitButton();
    tick();
    expect(mockSnackBar.open).toHaveBeenCalled();
    expect(mockSnackBar.open).toHaveBeenCalledWith((component as any).invalidDetailsMessage, anything(), anything());
  }));

  function updateForm(email: string = '', password: string = '') {
    component.loginForm.controls.email.setValue(email);
    component.loginForm.controls.password.setValue(password);
    fixture.detectChanges();
  }

  function clickSubmitButton() {
    const submitButtonDe: DebugElement = fixture.debugElement.query(By.css('button[type=submit]'));
    const submitButtonNe = submitButtonDe.nativeElement;
    submitButtonNe.click();
  }

});
