import {Injectable} from '@angular/core';
import {InMemoryDbService} from 'angular-in-memory-web-api';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {

  createDb() {
    const forums = [
      {
        id: 1,
        name: 'All about cars',
        description: 'All about my favourite cars etc etc etc',
      },
      {
        id: 2,
        name: 'Politics ... raaaaaage',
        description: 'Things that annoy me',
      },
    ];

    const posts = [
      {
        id: 1,
        forumId: 1,
        title: 'Red cars',
        body: 'Red cars are my absolute favourite I love red cars more than life itself.'
      },
      {
        id: 2,
        forumId: 1,
        title: 'Big engines are where it\'s at',
        body: 'Color is not important it\'s all about the engine. Must have at least 50 horses crammed in it.'
      },
      {
        id: 3,
        forumId: 2,
        title: 'Politicians are secretly venomous snakes ...',
        body: 'I know because a politician once bit me and now I\'m dead.'
      }
    ];
    return {forums, posts};
  }
}
