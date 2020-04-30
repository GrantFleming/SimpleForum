import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {ForumService} from '../../../forum/services/forum.service';
import {Forum} from '../../../forum/models/Forum';

@Component({
  selector: 'app-add-forum',
  templateUrl: './add-forum.component.html',
  styleUrls: ['./add-forum.component.scss']
})
export class AddForumComponent implements OnInit {

  @Output() newForumEvent = new EventEmitter();
  @ViewChild(FormGroupDirective) form;
  newForumForm: FormGroup;

  constructor(private fb: FormBuilder, private forumService: ForumService) {
    this.newForumForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(128)]],
      description: ['', [Validators.required]]
    });
  }

  get name() {
    return this.newForumForm.get('name');
  }

  get nameErrors(): string[] {
    return this.name.errors ? Object.keys(this.name.errors) : [];
  }

  get description() {
    return this.newForumForm.get('description');
  }

  get descriptionErrors(): string[] {
    return this.description.errors ? Object.keys(this.description.errors) : [];
  }

  ngOnInit(): void {
  }

  onSubmit(postData) {
    if (!this.newForumForm.valid) {
      return;
    }

    // submit new post to server and emit the event so the explorer can add
    // the newly created forum to the UI
    const newForum: Forum = {
      id: null,
      name: postData.name,
      description: postData.description
    };
    this.forumService.addForum(newForum).subscribe(
      createdForum => this.newForumEvent.emit(createdForum)
    );

    // and clear the form
    this.newForumForm.reset();
    // must reset the actual form too in order to reset it's 'isSubmitted' status
    this.form.resetForm();
  }

}
