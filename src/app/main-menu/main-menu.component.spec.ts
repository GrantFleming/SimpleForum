import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MainMenuComponent} from './main-menu.component';
import {AuthenticationService} from '../authentication/services/authentication.service';
import {By} from '@angular/platform-browser';
import objectContaining = jasmine.objectContaining;

describe('MainMenuComponent', () => {
  let component: MainMenuComponent;
  let fixture: ComponentFixture<MainMenuComponent>;
  let mockAuthService: Partial<AuthenticationService>;

  beforeEach(async(() => {
    // users are not logged in by default in these tests
    // override for individual tests where necessary
    mockAuthService = {
      isLoggedIn() {
        return false;
      }
    };

    TestBed.configureTestingModule({
      declarations: [MainMenuComponent],
      providers: [
        {provide: AuthenticationService, useValue: mockAuthService}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show a logout button if a user is logged in', () => {
    mockAuthService.isLoggedIn = () => true;
    fixture.detectChanges();

    const logoutButtonDe = fixture.debugElement.query(By.css('button.logout'));
    expect(logoutButtonDe).toBeTruthy();
  });

  it('should show a login link if no user is logged in', () => {
    fixture.detectChanges();
    const linkAttributes = fixture.debugElement.queryAll(By.css('a')).map(de => de.attributes);
    expect(linkAttributes).toContain(objectContaining({routerLink: '/user/login'}));
  });

  it('should show a register link if no user is logged in', () => {
    fixture.detectChanges();
    const linkAttributes = fixture.debugElement.queryAll(By.css('a')).map(de => de.attributes);
    expect(linkAttributes).toContain(objectContaining({routerLink: '/user/register'}));
  });

  it('should show a link to the forum explorer', () => {
    fixture.detectChanges();
    const linkAttributes = fixture.debugElement.queryAll(By.css('a')).map(de => de.attributes);
    expect(linkAttributes).toContain(objectContaining({routerLink: '/forums'}));
  });
});
