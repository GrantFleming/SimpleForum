import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ForumComponent} from './forum/components/forum/forum.component';
import {ForumExplorerComponent} from './forum-explorer/components/forum-explorer/forum-explorer.component';
import {Error404Component} from './error-pages/error404/error404.component';
import {ForumServiceCacheHeater} from './forum/services/forum-service-cache-heater.service';
import {PostServiceCacheHeater} from './forum/services/post-service-cache-heater.service';


const routes: Routes = [
  {path: '', redirectTo: 'forums', pathMatch: 'full'},
  {
    path: 'forums/:id',
    component: ForumComponent,
    resolve: {
      /**
       * These resolvers no not work the way typical resolvers work.
       * Their primary purpose is to ensure that the cache is hot in
       * their respective services meaning that any component that uses
       * them will get an immediate and synchronous response. This allows
       * us to reuse these 'resolvers' in many places.
       */
      ForumServiceCacheHeater,
      PostServiceCacheHeater
    }
  },
  {path: 'forums', component: ForumExplorerComponent},
  {path: 'page-not-found', component: Error404Component},
  {path: '**', redirectTo: 'page-not-found', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
