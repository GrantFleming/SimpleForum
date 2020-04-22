import {Injectable} from '@angular/core';
import {InMemoryDbService} from 'angular-in-memory-web-api';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {

  createDb() {
    const posts = [
      {
        id: 1,
        title: 'A post',
        body: 'Some text to make up the body of a post'
      },
      {
        id: 2,
        title: 'Will this',
        body: 'work now?'
      }
    ];
    return {posts};
  }
}
