import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AdminCalendarComponent } from './core/components/admin-calendar/admin-calendar.component';
import { AdminRegistrationsComponent } from './core/components/admin-registrations/admin-registrations.component';
import { AdminTotalComponent } from './core/components/admin-total/admin-total.component';
import { QrScannerComponent } from './core/components/qr-scanner/qr-scanner.component';
import { ProfileComponent } from './shared/components/profile/profile.component';
import { UserCalendarComponent } from './coreUser/components/user-calendar/user-calendar.component';
import { UserPreRegistrationsComponent } from './coreUser/components/user-pre-registrations/user-pre-registrations.component';
import { UserRegistrationsComponent } from './coreUser/components/user-registrations/user-registrations.component';
import { AdminGuard } from './guards/admin-guard.guard';
import { UserGuard } from './guards/user-guard.guard';

export const routes: Routes = [
    { path: 'admin/calendario', component: AdminCalendarComponent, canActivate: [AdminGuard] },
  { path: 'admin/total', component: AdminTotalComponent, canActivate: [AdminGuard] },
  { path: 'admin/registros', component: AdminRegistrationsComponent, canActivate: [AdminGuard] },
  { path: 'admin/escaneo', component: QrScannerComponent, canActivate: [AdminGuard] },
  { path: 'perfil', component: ProfileComponent },
  { path: 'user/calendario', component: UserCalendarComponent, canActivate: [UserGuard] },
  { path: 'user/preregistros', component: UserPreRegistrationsComponent, canActivate: [UserGuard] },
  { path: 'user/registros', component: UserRegistrationsComponent, canActivate: [UserGuard] },
  { path: '', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }