import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {Post} from '../../models/post';
import {PostService} from '../../services/post.service';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {

  @Output() newPostEvent = new EventEmitter();
  form;
  private post = new Post();

  constructor(private formBuilder: FormBuilder, private postService: PostService) {
  }

  get title() {
    return this.form.get('title');
  }

  get body() {
    return this.form.get('body');
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        title: new FormControl(this.post.title, [Validators.required, Validators.maxLength(100)]),
        body: new FormControl(this.post.body, [Validators.required])
      }
    );
  }

  onSubmit(postData) {
    if (this.title.invalid || this.body.invalid) {
      this.title.markAsDirty();
      this.body.markAsDirty();
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
    this.form.reset();
  }

}
