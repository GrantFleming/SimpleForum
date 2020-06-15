import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ForumExplorerComponent} from './forum-explorer.component';
import {By} from '@angular/platform-browser';
import {Component, Directive, EventEmitter, Input, Output} from '@angular/core';
import {Forum} from '../../../forum/models/Forum';
import {ActivatedRoute} from '@angular/router';
import {AuthenticationService} from '../../../authentication/services/authentication.service';

describe('ForumExplorerComponent', () => {
  let component: ForumExplorerComponent;
  let fixture: ComponentFixture<ForumExplorerComponent>;
  let mockActivatedRoute;
  let mockAuthService;

  beforeEach(async(() => {
    mockActivatedRoute = {snapshot: {queryParamMap: {has: () => false}}};
    mockAuthService = {isLoggedIn: () => false};

    TestBed.configureTestingModule({
      declarations: [
        ForumExplorerComponent,
        MockForumListComponent,
        MockAddForumComponent,
        QueryParamsStubDirective
      ],
      providers: [
        {provide: ActivatedRoute, useValue: mockActivatedRoute},
        {provide: AuthenticationService, useValue: mockAuthService}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a forum list', () => {
    const forumListDe = fixture.debugElement.query(By.css('app-forum-list'));
    expect(forumListDe).toBeTruthy();
  });

  it('should display an AddForumComponent if user is logged in', () => {
    mockAuthService.isLoggedIn = () => true;
    fixture.detectChanges();

    const addForumDe = fixture.debugElement.query(By.css('app-add-forum'));
    expect(addForumDe).toBeTruthy();
  });

  it('should call addForum in the ForumList on a newForumEvent passing the new forum (if the user is logged in)', () => {
    mockAuthService.isLoggedIn = () => true;
    fixture.detectChanges();

    const eventEmitter = fixture.debugElement
      .query(By.css('app-add-forum'))
      .componentInstance
      .newForumEvent;
    const mockForumList = fixture.debugElement
      .query(By.css('app-forum-list'))
      .componentInstance;

    const testForum: Forum = {
      id: null,
      name: null,
      description: null
    };

    eventEmitter.emit(testForum);
    expect(mockForumList.lastAddedForum).toBe(testForum);
  });

  it('should display a login-prompt instead of a new forum form if the user is not logged in', () => {
    // user is not logged in by default in this test suite
    const loginButtonDe = fixture.debugElement.query(By.css('button[routerLink]'));
    expect(loginButtonDe.attributes.routerLink).toEqual('/user/login');
  });
});

@Component({
  selector: 'app-forum-list',
  template: ''
})
class MockForumListComponent {
  private lastAddedForum: Forum;

  addForum(forum: Forum) {
    this.lastAddedForum = forum;
  }
}

@Component({
  selector: 'app-add-forum',
  template: ''
})
class MockAddForumComponent {
  @Output() newForumEvent = new EventEmitter();
}

@Directive({
// tslint:disable-next-line:directive-selector
  selector: '[queryParams]'
})
export class QueryParamsStubDirective {
  @Input('queryParams') params: any;
}
