import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Post} from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  baseURL = 'https://simpleforumbackend-boisterous-dog-yz.cfapps.io';
  postsEndpoint = '/posts';

  constructor(private http: HttpClient) {
  }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseURL}${this.postsEndpoint}`);
  }
}
