import {Component, Input, OnInit} from '@angular/core';
import {Forum} from '../../../forum/models/Forum';

@Component({
  selector: 'app-forum-info',
  templateUrl: './forum-info.component.html',
  styleUrls: ['./forum-info.component.scss']
})
export class ForumInfoComponent implements OnInit {

  @Input() forum: Forum;

  constructor() {
  }

  ngOnInit(): void {
  }

}
