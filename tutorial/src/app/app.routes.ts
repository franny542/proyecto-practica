import { Routes, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core'; 
import { CommonModule, isPlatformBrowser } from '@angular/common'; 
import { Home } from './pages/home/home';
import { PoliciesComponent } from './pages/policies/policies';
import { AdminPolicies } from './pages/admin-policies/admin-policies';
import { LoginComponent } from './pages/login/login'; 
import { RegisterComponent } from './pages/registro/registro';
import { UltimasConexionesComponent } from './pages/ultimas-conexiones/ultimas-conexiones';
import { ConfiguracionComponent } from './pages/configuracion/configuracion';
import { AuthService } from './services/auth.service';

const seguroGuard = (rolesPermitidos: string[]) => {
  return async () => { 
    const authService = inject(AuthService);
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID); 

    if (!isPlatformBrowser(platformId)) {
      return true;
    }

    const token = authService.getToken();
    const rawRol = authService.getUserRole() || '';
    const rol = rawRol.toLowerCase().trim();
    const rolesLimpios = rolesPermitidos.map(r => r.toLowerCase().trim());

    console.log('Token detectado:', token);
    console.log('Rol detectado:', rol);
    console.log('Permisos requeridos:', rolesLimpios);

    if (!token) {
      await new Promise(resolve => setTimeout(resolve, 50));
      alert('Acceso Restringido: Esta sección requiere autenticación previa.');
      return router.createUrlTree(['/']); 
    }

    if (rolesLimpios.includes(rol)) {
      return true;
    }

    await new Promise(resolve => setTimeout(resolve, 50));
    
    if (rol === 'admin' && rolesLimpios.includes('usuario')) {
      alert('Acceso Denegado: Su rol de Administrador no cuenta con los privilegios requeridos para el módulo de Últimas Conexiones.');
    } else {
      alert('Acceso Denegado: No tienes los permisos necesarios para ver esta página.');
    }

    return router.createUrlTree(['/']); 
  };
};

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegisterComponent },
  { path: 'policies', component: PoliciesComponent },
  {
    path: 'admin-policies',
    component: AdminPolicies,
    canActivate: [seguroGuard(['admin'])]
  },
  {
    path: 'configuracion',
    component: ConfiguracionComponent,
    canActivate: [seguroGuard(['admin'])]
  },
  {
    path: 'ultimas-conexiones',
    component: UltimasConexionesComponent,
    canActivate: [seguroGuard(['usuario'])], 
  }
];