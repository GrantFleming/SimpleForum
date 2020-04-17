import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ForumComponent} from './forum.component';
import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {Component} from '@angular/core';

describe('ForumComponent', () => {
  let component: ForumComponent;
  let fixture: ComponentFixture<ForumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, ReactiveFormsModule],
      declarations: [
        ForumComponent,
        MockPostFeedComponent,
        MockAddPostComponent
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
});

@Component({
  selector: 'app-post-feed',
  template: ''
})
class MockPostFeedComponent {
}

@Component({
  selector: 'app-add-post',
  template: ''
})
class MockAddPostComponent {
}
