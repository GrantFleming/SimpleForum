import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PostService} from '../../services/post.service';

@Component({
  selector: 'app-add-post[forumId]',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss']
})
export class AddPostComponent implements OnInit {

  @Input() forumId: number;
  @Output() newPostEvent = new EventEmitter();
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

  ngOnInit(): void {
  }

  onSubmit(postData) {
    // submit new post to server and emit the event so the forum can add
    // the newly created post to the UI
    const newPost = Object.assign({forumId: this.forumId}, postData);
    this.postService.addPost(newPost).subscribe(
      // must wait on the newly created post as the server assigns the id
      createdPost => this.newPostEvent.emit(createdPost)
    );
  }
}
