import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PostFeedComponent} from './post-feed.component';
import {PostService} from '../../services/post.service';
import {Observable} from 'rxjs';
import {PostComponent} from '../post/post.component';

describe('PostFeedComponent', () => {
  let mockPostService;
  let component: PostFeedComponent;
  let fixture: ComponentFixture<PostFeedComponent>;

  beforeEach(async(() => {

    // Provide a mock of the PostService to avoid http requests
    mockPostService = jasmine.createSpyObj(['getPosts']);
    mockPostService.getPosts.and.returnValue(
      new Observable(
        subscriber =>
          subscriber.next([{id: 1, title: 'A post', body: 'Some text to make up the body of a post'}]
          )));

    TestBed.configureTestingModule({
      declarations: [PostFeedComponent, PostComponent],
      providers: [{provide: PostService, useValue: mockPostService}]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
