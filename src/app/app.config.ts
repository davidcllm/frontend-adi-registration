import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from '@angular/common';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { CoreUserModule } from './coreUser/coreUser.module';
import { AdminGuard } from './guards/admin-guard.guard';
import { UserGuard } from './guards/user-guard.guard';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(
      FormsModule, 
      AuthModule, 
      CommonModule,
      CoreModule,
      SharedModule, 
      CoreUserModule,
      AdminGuard,
      UserGuard,
    )
  ]
};
