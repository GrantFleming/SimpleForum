import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ForumComponent} from './forum.component';
import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {Component, Input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';
import {By} from '@angular/platform-browser';
import {Post} from '../../models/post';

describe('ForumComponent', () => {
  let component: ForumComponent;
  let fixture: ComponentFixture<ForumComponent>;

  beforeEach(async(() => {
    const routeStub = {
      paramMap: of({get: (ignored: any) => 6})
    };

    TestBed.configureTestingModule({
      imports: [HttpClientModule, ReactiveFormsModule],
      declarations: [
        ForumComponent,
        MockPostFeedComponent,
        MockAddPostComponent
      ],
      providers: [
        {provide: ActivatedRoute, useValue: routeStub}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain a post feed for the forum', () => {
    const postFeedDe = fixture.debugElement.query(By.css('app-post-feed'));
    expect(postFeedDe).toBeTruthy();
    expect(postFeedDe.componentInstance.forumId).toBe(6); // as stub returns 6
  });

  it('should contain an add post component', () => {
    const addPostDe = fixture.debugElement.query(By.css('app-add-post'));
    expect(addPostDe).toBeTruthy();
  });
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
