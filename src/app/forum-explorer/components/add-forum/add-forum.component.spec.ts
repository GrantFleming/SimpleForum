import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {asyncData} from '../../../test_utils/test_async_utils';
import {Component, DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {ForumService} from '../../../forum/services/forum.service';
import {AddForumComponent} from './add-forum.component';
import {Forum} from '../../../forum/models/Forum';

describe('AddForumComponent', () => {
  let forumServiceStub: Partial<ForumService>;

  let component: AddForumComponent;
  let fixture: ComponentFixture<WrapperComponent>;

  beforeEach(async(() => {
    forumServiceStub = {
      // stub the server behaviour of returning the post object but with an id
      addForum: (forum: Forum) => asyncData<Forum>(Object.assign({id: 1}, forum))
    };
    spyOn(forumServiceStub, 'addForum').and.callThrough();

    TestBed.configureTestingModule({
      declarations: [
        AddForumComponent,
        MatFormFieldStubComponent,
        MatErrorStubComponent,
        MatLabelStubComponent,
        WrapperComponent
      ],
      imports: [
        ReactiveFormsModule, // for the [formGroup] directive
      ],
      providers: [
        FormBuilder,
        {provide: ForumService, useValue: forumServiceStub}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapperComponent);
    component = fixture.debugElement.children[0].componentInstance;
    fixture.detectChanges();
  });

  function updateForm(name: string = '', description: string = '') {
    component.newForumForm.controls.name.setValue(name);
    component.newForumForm.controls.description.setValue(description);
    component.newForumForm.controls.name.markAsDirty();
    component.newForumForm.controls.name.markAsTouched();
    component.newForumForm.controls.description.markAsDirty();
    component.newForumForm.controls.description.markAsTouched();
    fixture.detectChanges(); // to enable/disable the submit button accordingly
  }

  function clickSubmitButton() {
    const submitButtonDe: DebugElement = fixture.debugElement.query(By.css('button[type=submit]'));
    const submitButtonNe = submitButtonDe.nativeElement;
    submitButtonNe.click();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should create a form that has fields for each element of a Forum (except id)', () => {
    const controls = component.newForumForm.controls;
    // so the type checker will remind us if we ever update the Forum model
    const emptyForum: Forum = {id: null, name: null, description: null, creator: null};
    expect(Object.keys(controls).length)
      .toBe(
        // -2 as the form should not render a control for the ID or the creator
        // theses properties are populated server-side
        Object.getOwnPropertyNames(emptyForum as Forum).length - 2,
        'doesn\'t have the right number of controls');

    for (const key of Object.keys(emptyForum as Forum)) {
      if (key === 'id' || key === 'creator') {
        continue;
      }
      expect(Object.keys(controls)).toContain(key, 'doesn\'t contain a control for some property of Post');
    }
  });


  it('should initialize the form with empty fields', () => {
    const controls = component.newForumForm.controls;
    for (const key of Object.keys(controls)) {
      expect(controls[key].value).toBe('');
    }
  });


  it('should submit a post to the forumService on submit', () => {
    const testForum: Forum = {
      id: undefined,
      name: 'A forum title',
      description: 'A forum description',
      creator: undefined
    };
    updateForm(testForum.name, testForum.description);
    clickSubmitButton();

    // the method should called with the correct value
    expect(forumServiceStub.addForum).toHaveBeenCalledWith(testForum);
  });


  it('should not submit an invalid form to the forumService', () => {
    // should not submit a form with empty fields
    updateForm('', 'x');
    clickSubmitButton();
    expect(forumServiceStub.addForum).not.toHaveBeenCalled();
    updateForm('x', '');
    clickSubmitButton();
    expect(forumServiceStub.addForum).not.toHaveBeenCalled();

    // should not submit a form with an overly long name
    updateForm('x'.repeat(129), 'x');
    clickSubmitButton();
    expect(forumServiceStub.addForum).not.toHaveBeenCalled();
  });


  it('should clear the form after a valid submission', () => {
    updateForm('x', 'x');
    clickSubmitButton();
    const controls = component.newForumForm.controls;

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
    expect(component.form.submitted).toBeFalse();
  });


  it('should not clear the form after an invalid submission', () => {
    updateForm('', 'x'); // invalid lack of title
    clickSubmitButton();
    const controls = component.newForumForm.controls;
    // the form controls should not contain null values
    for (const key of Object.keys(controls)) {
      expect(controls[key].value).not.toBe(null);
    }
  });


  it('should not display errors for a valid fields', () => {
    updateForm('x', 'x');
    expect(component.nameErrors.length).toBe(0);
    expect(component.descriptionErrors.length).toBe(0);
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
  template: '<app-add-forum></app-add-forum>'
})
class WrapperComponent {
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
