import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Post} from '../models/post';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private baseURL: string = environment.backendHost;
  private postsEndpoint = '/posts';

  constructor(private http: HttpClient) {
  }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseURL}${this.postsEndpoint}`);
  }

  addPost(post: Post): Observable<Post> {
    return this.http.post<Post>(`${this.baseURL}${this.postsEndpoint}`, post);
  }

}
