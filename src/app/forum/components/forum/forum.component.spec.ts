import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {ForumComponent} from './forum.component';
import {Component, Directive, HostListener, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {By} from '@angular/platform-browser';
import {Post} from '../../models/post';
import {ForumService} from '../../services/forum.service';
import {Forum} from '../../models/Forum';
import {asyncData, asyncError} from '../../../test_utils/test_async_utils';
import {AuthenticationService} from '../../../authentication/services/authentication.service';

describe('ForumComponent', () => {
  let fixture: ComponentFixture<ForumComponent>;
  let component: ForumComponent;
  const testForumId = 3;
  // The ActivatedRoute spy
  const routeSpy = {
    paramMap: of({get: (ignored: any) => testForumId})
  };
  // the ForumService spy
  const testForum: Forum = {id: testForumId, name: 'a forum name', description: 'a forum description'};
  const mockForumService: Partial<ForumService> = {
    getForum(id: number): Observable<Forum> {
      return asyncData(testForum);
    }
  };
  const routerSpy = jasmine.createSpyObj(Router, ['navigateByUrl']);
  let mockAuthService;


  beforeEach(async(() => {
    mockAuthService = {isLoggedIn: () => false};

    TestBed.configureTestingModule({
      declarations: [
        ForumComponent,
        MockPostFeedComponent,
        MockAddPostComponent,
        RouterLinkStubDirective,
        QueryParamsStubDirective
      ],
      providers: [
        {provide: ActivatedRoute, useValue: routeSpy},
        {provide: ForumService, useValue: mockForumService},
        {provide: Router, useValue: routerSpy},
        {provide: AuthenticationService, useValue: mockAuthService}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    spyOn(routeSpy.paramMap, 'subscribe').and.callThrough();
    spyOn(mockForumService, 'getForum').and.callThrough();
    fixture = TestBed.createComponent(ForumComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display loading notification while the forum is not yet loaded', () => {
    fixture.detectChanges(); // ngOnInit
    // but no tick in fakeAsync zone so that forum remains undefined

    // as it's forum parameter is undefined, it should display a loading widget
    const loadingElement = fixture.debugElement.query(By.css('.loading-widget'));
    expect(loadingElement).toBeTruthy();
    expect(loadingElement.nativeElement.textContent).toBeTruthy(); // exact message not important now
  });

  it('should contain a post feed for the forum', fakeAsync(() => {
    retrieveDataAndRender(fixture);

    const postFeedDe = fixture.debugElement.query(By.css('app-post-feed'));
    expect(postFeedDe).toBeTruthy();
    expect(postFeedDe.componentInstance.forumId).toBe(testForumId);
  }));

  it('should contain an add post component if the user is logged in after the forum is loaded from ForumService', fakeAsync(() => {
    mockAuthService.isLoggedIn = () => true;

    retrieveDataAndRender(fixture);

    const addPostDe = fixture.debugElement.query(By.css('app-add-post'));
    expect(addPostDe).toBeTruthy();
  }));

  it('should request a forum with the route specified ID from the service', () => {
    fixture.detectChanges(); // ngOnInit

    expect(routeSpy.paramMap.subscribe).toHaveBeenCalled();
    expect(mockForumService.getForum).toHaveBeenCalledWith(testForumId);
  });

  it('should display the forum name after it has loaded', fakeAsync(() => {
    retrieveDataAndRender(fixture);

    const forumNameDe = fixture.debugElement.query(By.css('.forum-name'));
    expect(forumNameDe).toBeTruthy('the element that displays the forum name should exist');
    const displayedName = forumNameDe.nativeElement.textContent;
    expect(displayedName).toEqual(testForum.name);
  }));

  it('should display the forum descriptions', fakeAsync(() => {
    retrieveDataAndRender(fixture);

    const forumDescDe = fixture.debugElement.query(By.css('.forum-desc'));
    expect(forumDescDe).toBeTruthy('the element that displays the forum description should exist');
    const displayedDesc = forumDescDe.nativeElement.textContent;
    expect(displayedDesc).toEqual(testForum.description);
  }));

  it('should contain a button to get back to the forum explorer', () => {
    const forumExplorerButtonDe = fixture.debugElement.query(By.css('.control-bar .forum-explorer-button'));
    expect(forumExplorerButtonDe).toBeTruthy();
  });

  it('should navigate to "/forums" when the forum explorer button is clicked', fakeAsync(() => {
    fixture.detectChanges();
    const forumExplorerButtonDe = fixture.debugElement.query(By.css('.control-bar .forum-explorer-button'));
    forumExplorerButtonDe.nativeElement.click();
    const routerLink = forumExplorerButtonDe.injector.get(RouterLinkStubDirective);
    expect(routerLink.navigatedTo).toEqual('/forums');
  }));

  it('should navigate to "/page-not-found" if the ForumService errors', fakeAsync(() => {
    // before ngOnInit
    // make forum service error for any input
    mockForumService.getForum = (id: number) => asyncError('any');
    fixture.detectChanges(); // ngOnInit
    tick(); // allow the error to be returned asynchronously
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/page-not-found', jasmine.anything());
  }));

  it('should display a login-prompt instead of a new forum form if the user is not logged in', fakeAsync(() => {
    retrieveDataAndRender(fixture);

    // user is not logged in by default in this test suite
    const loginButtonDe = fixture.debugElement.query(By.css('button.login_prompt'));
    expect(loginButtonDe.attributes.routerLink).toEqual('/user/login');
  }));
});

/**
 * Initializes the component, awaits component requested data then calls
 * change detection to render the final component.
 *
 * Only to be used inside fakeAsync zone
 */
function retrieveDataAndRender(fixture: ComponentFixture<ForumComponent>) {
  fixture.detectChanges();  // ngOnInit
  tick();                   // to allow the forum service to return data
  fixture.detectChanges();  // and render the final template after data retrieval
}

@Component({
  selector: 'app-post-feed',
  template: ''
})
class MockPostFeedComponent {
  @Input() forumId: number;

  addPost(post: Post) {
    return;
  }
}

@Component({
  selector: 'app-add-post',
  template: ''
})
class MockAddPostComponent {
  @Input() forumId: number;
}

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[routerLink]'
})
export class RouterLinkStubDirective {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  @HostListener('click')
  onClick() {
    this.navigatedTo = this.linkParams;
  }
}

@Directive({
// tslint:disable-next-line:directive-selector
  selector: '[queryParams]'
})
export class QueryParamsStubDirective {
  @Input('queryParams') params: any;
}
