import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { PoliciesComponent } from './pages/policies/policies';
import { AdminPolicies } from './pages/admin-policies/admin-policies';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },

  {
    path: 'policies',
    component: PoliciesComponent
  },

  {
    path: 'admin-policies',
    component: AdminPolicies
  }
];