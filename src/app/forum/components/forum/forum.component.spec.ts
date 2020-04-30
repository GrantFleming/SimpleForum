import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {ForumComponent} from './forum.component';
import {Component, Directive, HostListener, Input} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Observable, of} from 'rxjs';
import {By} from '@angular/platform-browser';
import {Post} from '../../models/post';
import {ForumService} from '../../services/forum.service';
import {Forum} from '../../models/Forum';
import {asyncData} from '../../../test_utils/test_async_utils';

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


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ForumComponent,
        MockPostFeedComponent,
        MockAddPostComponent,
        RouterLinkDirectiveStub
      ],
      providers: [
        {provide: ActivatedRoute, useValue: routeSpy},
        {provide: ForumService, useValue: mockForumService},
        {provide: RouterLink, useValue: RouterLinkDirectiveStub}
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
    fixture.detectChanges(); // ngOnInit
    tick();
    fixture.detectChanges(); // update the view

    const postFeedDe = fixture.debugElement.query(By.css('app-post-feed'));
    expect(postFeedDe).toBeTruthy();
    expect(postFeedDe.componentInstance.forumId).toBe(testForumId);
  }));

  it('should contain an add post component after the forum is loaded from ForumService', fakeAsync(() => {
    fixture.detectChanges(); // ngOnInit
    tick(); // get the forum etc
    fixture.detectChanges(); // updated the view

    const addPostDe = fixture.debugElement.query(By.css('app-add-post'));
    expect(addPostDe).toBeTruthy();
  }));

  it('should request a forum with the route specified ID from the service', () => {
    fixture.detectChanges(); // ngOnInit

    expect(routeSpy.paramMap.subscribe).toHaveBeenCalled();
    expect(mockForumService.getForum).toHaveBeenCalledWith(testForumId);
  });

  it('should display the forum name after it has loaded', fakeAsync(() => {
    fixture.detectChanges(); // ngOnInit
    tick();
    fixture.detectChanges(); // update the view

    const forumNameDe = fixture.debugElement.query(By.css('.forum-name'));
    expect(forumNameDe).toBeTruthy('the element that displays the forum name should exist');
    const displayedName = forumNameDe.nativeElement.textContent;
    expect(displayedName).toEqual(testForum.name);
  }));

  it('should display the forum descriptions', fakeAsync(() => {
    fixture.detectChanges(); // ngOnInit
    tick();
    fixture.detectChanges(); // update the view

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
    const routerLink = forumExplorerButtonDe.injector.get(RouterLinkDirectiveStub);
    expect(routerLink.navigatedTo).toEqual(['/forums']);
  }));
});

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
// tslint:disable-next-line:directive-class-suffix
export class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  @HostListener('click')
  onClick() {
    this.navigatedTo = this.linkParams;
  }
}
