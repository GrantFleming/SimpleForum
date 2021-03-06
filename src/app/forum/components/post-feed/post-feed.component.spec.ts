import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {PostFeedComponent} from './post-feed.component';
import {PostService} from '../../services/post.service';
import {asyncData} from '../../../test_utils/test_async_utils';
import {Post} from '../../models/post';
import {Component, DebugElement, Input} from '@angular/core';
import {By} from '@angular/platform-browser';

describe('PostFeedComponent', () => {
  let postServiceStub: Partial<PostService>;
  const expectedPosts: Post[] = [
    {
      id: 1,
      forumId: 1,
      title: 'A post',
      body: 'Some text to make up the body of a post',
      creator: 'A creator'
    },
    {
      id: 2,
      forumId: 1,
      title: 'Another post',
      body: 'Another body of yet another post',
      creator: 'Another creator'
    }];

  let component: PostFeedComponent;
  let fixture: ComponentFixture<WrapperComponent>;

  beforeEach(async(() => {

    postServiceStub = {
      // give back null if an argument is not provided to the function
      getPosts: (forumId: number) => (forumId ? asyncData<Post[]>([...expectedPosts]) : null)
    };

    TestBed.configureTestingModule({
      declarations: [
        PostFeedComponent,
        StubbedPostComponent,
        WrapperComponent // to provide @Input()
      ],
      providers: [{provide: PostService, useValue: postServiceStub}]
    }).compileComponents();
  }));

  beforeEach(() => {
    // Create the WrapperComponent as this injects the @Input()
    fixture = TestBed.createComponent(WrapperComponent);
    // Then get the component instance as a child of its DebugElement
    component = fixture.debugElement.children[0].componentInstance;
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no app-post elements before the server info arrives', fakeAsync(() => {
    fixture.detectChanges(); // OnInit
    // Before the response from the service arrives check no posts are listed:
    const appPosts: DebugElement[] = fixture.debugElement.queryAll(By.css('app-post'));
    expect(appPosts).toEqual([]);

    tick();
    fixture.destroy(); // to remove it's update timer from the queue
  }));

  it('should create an app-post component for each post it retrieves from the server', fakeAsync(() => {
    fixture.detectChanges(); // onInit
    tick(); // to get the asynchronous result from service
    fixture.detectChanges(); // notify angular that data needs rebound to template
    expect(component.posts.length).toBe(2);

    const appPosts: DebugElement[] = fixture.debugElement.queryAll(By.css('app-post'));
    expect(appPosts.length).toBe(2);

    fixture.destroy(); // to remove it's update timer from the queue
  }));

  it('should pass the posts to the PostComponent children', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(component.posts.length).toBe(2);

    const appPosts: DebugElement[] = fixture.debugElement.queryAll(By.css('app-post'));
    expect(appPosts[0].componentInstance.post).toBe(expectedPosts[0]);
    expect(appPosts[1].componentInstance.post).toBe(expectedPosts[1]);

    fixture.destroy(); // to remove it's update timer from the queue
  }));

  it('#addPost should add another post to the component', fakeAsync(() => {
    fixture.detectChanges(); // OnInit
    tick(); // to allow the asynchronous loading of posts from server

    component.addPost({id: 3, forumId: 1, title: 'a third post', body: 'a third body', creator: 'another creator'});
    expect(component.posts.length).toBe(3);

    fixture.destroy(); // to remove it's update timer from the queue
  }));

  it('#addPost should result in a new post being rendered in the template', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    const testPost: Post = {id: 3, forumId: 1, title: 'a third post', body: 'a third body', creator: 'another creator'};
    component.addPost(testPost);
    fixture.detectChanges();

    const appPosts: DebugElement[] = fixture.debugElement.queryAll(By.css('app-post'));
    expect(appPosts.length).toBe(3);
    expect(appPosts[2].componentInstance.post).toEqual(testPost);

    fixture.destroy(); // to remove it's update timer from the queue
  }));

  it('should have a bound forumId', () => {
    fixture.componentInstance.forumId = 999;
    fixture.detectChanges();
    expect(component.forumId).toBe(999);
  });

  it('should throw an error if we try to make it\'s forumId attribute undefined or null', () => {
    expect(
      () => {
        fixture.componentInstance.forumId = undefined;
        fixture.detectChanges();
      }
    ).toThrow();
    expect(
      () => {
        fixture.componentInstance.forumId = null;
        fixture.detectChanges();
      }
    ).toThrow();
  });

  it('should display the no-posts notification if there are no posts', fakeAsync(() => {
    fixture.detectChanges();  // ngOnInit
    tick();                   // get the posts (but the returned list is empty)
    component.posts = [];     // get rid of all the posts
    fixture.detectChanges();  // update the view

    // There should be no app-posts
    let appPosts: DebugElement[] = fixture.debugElement.queryAll(By.css('app-post'));
    expect(appPosts.length).toBe(0);

    let noPostNotificationDe = fixture.debugElement.query(By.css('.noPostNotification'));
    expect(noPostNotificationDe).toBeTruthy();
    // I don't care to unit test the exact nature of the error message. Just the one is shown and is non-empty
    expect(noPostNotificationDe.nativeElement.textContent).toBeTruthy();

    // should NOT display the error message for null
    // as this just means the server hasn't responded yet
    component.posts = null;
    fixture.detectChanges();
    appPosts = fixture.debugElement.queryAll(By.css('app-post'));
    expect(appPosts.length).toBe(0);
    noPostNotificationDe = fixture.debugElement.query(By.css('.noPostNotification'));
    expect(noPostNotificationDe).toBeFalsy();

    fixture.destroy(); // to remove it's update timer from the queue
  }));

  it('should update the posts every 5 seconds', fakeAsync(() => {
    fixture.detectChanges();  // ngOnInit
    tick();                   // get forums from service
    fixture.detectChanges();  // update the view

    const newPosts: Post[] = [
      {
        id: 9,
        forumId: 5,
        title: 'new title',
        body: 'new body',
        creator: 'a creator'
      }
    ];
    postServiceStub.getPosts = (forumId: number) => (forumId ? asyncData<Post[]>([...newPosts]) : null);
    tick(5000);
    fixture.detectChanges();
    let postComponentDes = fixture.debugElement.queryAll(By.css('app-post'));
    expect(postComponentDes.length).toBe(newPosts.length);
    expect(postComponentDes.map(value => value.componentInstance.post)).toEqual(newPosts);

    const moreNewPosts: Post[] = [
      {
        id: 12,
        forumId: 4,
        title: 'another new post title',
        body: 'another new body with more info etc',
        creator: 'a creator'
      }
    ];
    postServiceStub.getPosts = (forumId: number) => (forumId ? asyncData<Post[]>([...moreNewPosts]) : null);
    // after 4999 millis the old data should still be in the view
    tick(4999);
    fixture.detectChanges();
    postComponentDes = fixture.debugElement.queryAll(By.css('app-post'));
    expect(postComponentDes.length).toBe(newPosts.length);
    expect(postComponentDes.map(value => value.componentInstance.post)).toEqual(newPosts);
    // then after 5000 the new data should be in the view
    tick(1);
    fixture.detectChanges();
    postComponentDes = fixture.debugElement.queryAll(By.css('app-post'));
    expect(postComponentDes.length).toBe(moreNewPosts.length);
    expect(postComponentDes.map(value => value.componentInstance.post)).toEqual(moreNewPosts);

    fixture.destroy(); // to remove it's update timer from the queue
  }));
});


@Component({
  selector: 'app-post',
  template: '<div></div>'
  // template needs to contain an element as the component accesses it's children
})
class StubbedPostComponent {
  @Input() post: Post;
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'wrapper',
  template: '<app-post-feed [forumId]="forumId"></app-post-feed>'
})
class WrapperComponent {
  forumId = 6;
}
