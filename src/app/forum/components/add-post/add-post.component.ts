import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {Post} from '../../models/post';
import {PostService} from '../../services/post.service';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss']
})
export class AddPostComponent implements OnInit {

  @Output() newPostEvent = new EventEmitter();
  @ViewChild(FormGroupDirective) form;
  newPostForm: FormGroup;

  constructor(private fb: FormBuilder, private postService: PostService) {
    this.newPostForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(128)]],
      body: ['', [Validators.required]]
    });
  }

  get title() {
    return this.newPostForm.get('title');
  }

  get titleErrors(): string[] {
    return this.title.errors ? Object.keys(this.title.errors) : [];
  }

  get body() {
    return this.newPostForm.get('body');
  }

  get bodyErrors(): string[] {
    return this.body.errors ? Object.keys(this.body.errors) : [];
  }

  get allErrors(): string[] {
    return [].concat(...Object.keys(this.newPostForm.controls)
      .map(key =>
        this.newPostForm.controls[key].errors ?
          Object.keys(this.newPostForm.controls[key].errors) :
          []));
  }

  ngOnInit(): void {
  }

  onSubmit(postData) {
    if (!this.newPostForm.valid) {
      // TODO - push a message when there is some kind of notification system
      return;
    }

    // submit new post to server and emit the event so the forum can add
    // the newly created post to the UI
    const newPost = new Post();
    newPost.title = postData.title;
    newPost.body = postData.body;
    this.postService.addPost(newPost).subscribe(
      createdPost => this.newPostEvent.emit(createdPost)
    );

    // and clear the form
    this.newPostForm.reset();
    // must reset the actual form too in order to reset it's 'isSubmitted' status
    this.form.resetForm();
  }
}
