import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://api-rukano-f0hafjcjd8dufqck.westus3-01.azurewebsites.net/api/Auth';
  private TOKEN_KEY = 'authToken';
  public mensajeAlertaPendiente: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(correo: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { correo, password }).pipe(
      tap(response => {
        if (isPlatformBrowser(this.platformId) && response && response.token) {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          try {
            const decoded: any = jwtDecode(response.token);
            const rolToken = decoded['role'] || 'usuario';
            localStorage.setItem('rol', rolToken);
          } catch (error) {
            localStorage.setItem('rol', 'usuario');
          }
        }
      })
    );
  }

  registrarUsuario(datosUsuario: any): Observable<any> {
    const usuarioSeguro = {
      ...datosUsuario,
      rol: 'usuario'
    };
    return this.http.post<any>(`${this.apiUrl}/register`, usuarioSeguro);
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.TOKEN_KEY) || localStorage.getItem('token');
    }
    return null;
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  getUserRole(): string {
      if (typeof window !== 'undefined' && window.localStorage) {
        const token = this.getToken();
        if (token) {
          try {
            const decoded: any = jwtDecode(token);
            
            const rolReal = decoded['role'] || 
                            decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            
            return rolReal || 'usuario';
          } catch (error) {
            return 'usuario';
          }
        }
      }
      return ''; 
    }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
      this.router.navigate(['/']).then(() => {
        window.location.reload();
      });
    }
  }
  
  getUltimasConexiones(): Observable<any[]> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.apiUrl}/ultimas-conexiones`, { headers });
  }

  getUsuarios(): Observable<any[]> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.apiUrl}/usuarios`, { headers });
  }

  cambiarRolUsuario(usuarioId: number, nuevoRol: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<any>(`${this.apiUrl}/cambiar-rol`, { usuarioId, rol: nuevoRol }, { headers });
  }
}