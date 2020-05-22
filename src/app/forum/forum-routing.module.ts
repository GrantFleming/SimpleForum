import {NgModule} from '@angular/core';
import {ForumComponent} from './components/forum/forum.component';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: '', component: ForumComponent}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class ForumRoutingModule {
}
