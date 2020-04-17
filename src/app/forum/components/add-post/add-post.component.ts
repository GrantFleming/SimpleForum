import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Post} from '../../models/post';
import {PostService} from '../../services/post.service';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {

  @Output() newPostEvent = new EventEmitter();
  newPostForm: FormGroup;

  constructor(private fb: FormBuilder, private postService: PostService) {
    this.newPostForm = this.fb.group({
      title: [''],
      body: ['']
    });
  }

  get title() {
    return this.newPostForm.get('title');
  }

  get body() {
    return this.newPostForm.get('body');
  }

  ngOnInit(): void {
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
    this.newPostForm.reset();
  }

}
