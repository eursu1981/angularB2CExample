import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MsalGuard } from '@azure/msal-angular';
import { DataPageComponent } from './data-page/data-page.component';
import { AuthGuard } from './authentication/auth-guard';
import { AppPermission } from './authentication/app-permissions';
import { AccessDeniedComponent } from './authentication/access-denied/access-denied.component';

const routes: Routes = [
  {
    path: 'dataPage',
    component: DataPageComponent,
    canActivate: [MsalGuard, AuthGuard],
    data: {
      permissions: [
        // AppPermission.salesPermission,
        // AppPermission.businessPartnerPermission,
      ],
    },
  },
  { path: 'accessdenied', component: AccessDeniedComponent },
  {
    // Needed for hash routing
    path: 'error',
    component: HomeComponent,
  },
  {
    // Needed for hash routing
    path: 'state',
    component: HomeComponent,
  },
  {
    // Needed for hash routing
    path: 'code',
    component: HomeComponent,
  },
  {
    path: '',
    component: HomeComponent,
  },
];

const isIframe = window !== window.parent && !window.opener;

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      // Don't perform initial navigation in iframes
      initialNavigation: !isIframe ? 'enabled' : 'disabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
