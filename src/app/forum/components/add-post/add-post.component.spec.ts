import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddPostComponent} from './add-post.component';
import {FormBuilder, FormGroupDirective, ReactiveFormsModule} from '@angular/forms';
import {PostService} from '../../services/post.service';
import {asyncData} from '../../../test_utils/test_async_utils';
import {Post} from '../../models/post';
import {Component, DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';

describe('AddPostComponent', () => {
  let postServiceStub: Partial<PostService>;

  let component: AddPostComponent;
  let fixture: ComponentFixture<WrapperComponent>;

  beforeEach(async(() => {
    postServiceStub = {
      // stub the server behaviour of returning the post object but with an id
      addPost: (post: Post) => asyncData<Post>(Object.assign({id: 1}, post))
    };
    spyOn(postServiceStub, 'addPost').and.callThrough();

    TestBed.configureTestingModule({
      declarations: [
        AddPostComponent,
        MatFormFieldStubComponent,
        MatErrorStubComponent,
        MatLabelStubComponent,
        WrapperComponent
      ],
      imports: [
        ReactiveFormsModule, // for the [formGroup] directive,
      ],
      providers: [
        FormBuilder,
        {provide: PostService, useValue: postServiceStub}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapperComponent);
    component = fixture.debugElement.children[0].componentInstance;
    fixture.detectChanges();
  });

  function updateForm(title: string = '', body: string = '') {
    component.newPostForm.controls.title.setValue(title);
    component.newPostForm.controls.body.setValue(body);
    component.newPostForm.controls.title.markAsDirty();
    component.newPostForm.controls.title.markAsTouched();
    component.newPostForm.controls.body.markAsDirty();
    component.newPostForm.controls.body.markAsTouched();
    fixture.detectChanges();
  }

  function clickSubmitButton() {
    const submitButtonDe: DebugElement = fixture.debugElement.query(By.css('button[type=submit]'));
    const submitButtonNe = submitButtonDe.nativeElement;
    submitButtonNe.click();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should create a form that has fields for each element of a Post (except id)', () => {
    const controls = component.newPostForm.controls;
    // -1 as the form should not render a control for the ID
    expect(Object.keys(controls).length).toBe(Object.getOwnPropertyNames(new Post()).length, 'doesn\'t have the right number of controls');

    for (const key of Object.keys(new Post())) {
      expect(Object.keys(controls)).toContain(key, 'doesn\'t contain a control for some property of Post');
    }
  });


  it('should initialize the form with empty fields', () => {
    const controls = component.newPostForm.controls;
    for (const key of Object.keys(controls)) {
      expect(controls[key].value).toBe('');
    }
  });


  it('should submit a post to the postService on submit', () => {
    spyOn(component, 'onSubmit').and.callThrough();

    const testPost = new Post();
    testPost.title = 'A post title';
    testPost.body = 'A post body';
    updateForm(testPost.title, testPost.body);
    fixture.componentInstance.forumId = 3;

    clickSubmitButton();
    // the method should called with the correct value (adding in the forum id!)
    expect(postServiceStub.addPost).toHaveBeenCalledWith(Object.assign({forumId: 3}, testPost));
  });


  it('should not submit an invalid form to the postService', () => {
    // should not submit a form with empty fields
    updateForm('', 'x');
    clickSubmitButton();
    expect(postServiceStub.addPost).not.toHaveBeenCalled();
    updateForm('x', '');
    clickSubmitButton();
    expect(postServiceStub.addPost).not.toHaveBeenCalled();

    // should not submit a form with an overly long title
    updateForm('x'.repeat(129), 'x');
    clickSubmitButton();
    expect(postServiceStub.addPost).not.toHaveBeenCalled();
  });

  it('should clear the form after a valid submission', () => {
    updateForm('x', 'x');
    clickSubmitButton();
    const controls = component.newPostForm.controls;
    /*
    Every form control should have a null value after reset and should
    be rendered as the empty string
     */
    for (const key of Object.keys(controls)) {
      expect(controls[key].value).toBe(null);
      expect(fixture.debugElement.query(By.css(`#${key}`)).nativeElement.textContent).toBe('');
    }
  });


  it('should reset the forms submitted status after a valid submission', () => {
    updateForm('x', 'x');
    clickSubmitButton();
    const formGroupDirective: FormGroupDirective = fixture.debugElement.query(By.css('form')).injector.get(FormGroupDirective);
    expect(formGroupDirective.submitted).toBeFalse();
  });


  it('should not clear the form after an invalid submission', () => {
    updateForm('', 'x'); // invalid lack of title
    clickSubmitButton();
    const controls = component.newPostForm.controls;
    // the form controls should not contain null values
    for (const key of Object.keys(controls)) {
      expect(controls[key].value).not.toBe(null);
    }
  });


  it('should not display errors for a valid fields', () => {
    updateForm('x', 'x');
    expect(component.titleErrors.length).toBe(0);
    expect(component.bodyErrors.length).toBe(0);
  });


  it('should have a mat-error in each mat-form-field', () => {
    // every mat-form-field should contain a mat-error
    const formFieldsDe = fixture.debugElement.queryAll(By.css('mat-form-field'));
    for (const fieldDe of formFieldsDe) {
      const error = fieldDe.query(By.css('mat-error'));
      expect(error).toBeTruthy();
    }
  });
});

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'wrapper',
  template: '<app-add-post [forumId]="forumId"></app-add-post>'
})
class WrapperComponent {
  forumId = 3;
}

// Material stubs:


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mat-form-field',
  template: '<ng-content></ng-content>'
})
class MatFormFieldStubComponent {
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mat-label',
  template: '<ng-content></ng-content>'
})
class MatLabelStubComponent {
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mat-error',
  template: '<ng-content></ng-content>'
})
class MatErrorStubComponent {
}
