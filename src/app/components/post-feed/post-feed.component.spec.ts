import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PostFeedComponent} from './post-feed.component';
import {HttpClientModule} from '@angular/common/http';

describe('PostFeedComponent', () => {
  let component: PostFeedComponent;
  let fixture: ComponentFixture<PostFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [PostFeedComponent]
    })
      .compileComponents();
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
