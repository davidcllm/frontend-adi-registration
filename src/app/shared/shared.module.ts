import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './components/profile/profile.component';
import { AdminNavbarComponent } from './components/admin-navbar/admin-navbar.component';
import { UserNavbarComponent } from './components/user-navbar/user-navbar.component';

@NgModule({
  declarations: [
  
  ],
  imports: [
    CommonModule,
    ProfileComponent,
    AdminNavbarComponent, 
    UserNavbarComponent,
  ],
  exports: [

  ]
})
export class SharedModule { }
