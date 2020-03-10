import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from '../app.component';
import { LoginComponent } from '../login/login.component';
import { SearchComponent } from '../search/search.component';
import { DetailsComponent } from '../details/details.component';
import { ContactComponent } from '../contact/contact.component';

const rutas: Routes = [
  //{path: 'home', component: AppComponent},
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'search', component: SearchComponent},
  {path: 'details/:docType/:docId', component: DetailsComponent},
  {path: 'contact', component: ContactComponent}
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(rutas, {useHash: true}),
  ],
  exports: [RouterModule],
})
export class RouteModule { }
