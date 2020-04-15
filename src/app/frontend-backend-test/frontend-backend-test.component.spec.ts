import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FrontendBackendTestComponent} from './frontend-backend-test.component';

describe('FrontendBackendTestComponent', () => {
  let component: FrontendBackendTestComponent;
  let fixture: ComponentFixture<FrontendBackendTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FrontendBackendTestComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontendBackendTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
