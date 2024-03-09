import { Observable, catchError, throwError, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  private baseUrl = 'http://localhost:8080';
  constructor(private http: HttpClient) { }

  createUser(userData: any): Observable<any> {

    const { password, ...userDataWithoutPassword } = userData;

    // Enviar los datos al endpoint correspondiente
    return this.http.post(`${this.baseUrl}/Users`, userDataWithoutPassword).pipe(
      catchError(error => {
        console.error('Error al crear usuario:', error);
        return throwError(error);
      })
    );
  }

  createLogin(userData: any): Observable<any> {

    const { userId, password } = userData;

    return this.http.post(`${this.baseUrl}/auth/register`, { userId, password }).pipe(
      catchError(error => {
        console.error('Error al crear usuario:', error);
        return throwError(error);
      })
    );
  }


  getUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Users`).pipe(
      catchError(error => {
        console.error('Error al obtener usuarios:', error);
        return throwError(error);
      })
    );
  }



  login(userId: string, password: string): Observable<boolean> {
    // Objeto con los datos del usuario para enviar al backend
    const loginUser = { userId, password };

    // Realizar la petición POST al endpoint de login
    return this.http.post<boolean>(`${this.baseUrl}/auth/login`, loginUser);
  }

  getUser(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Users/perfilbyid`, data).pipe(
      catchError(error => {
        console.error('Error al obtener usuario:', error);
        return throwError(error);
      })
    );
  }

  updateUsers(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Users/update`, data).pipe(
      catchError(error => {
        console.error('Error al actualizar usuario:', error);
        return throwError(error);
      })
    );
  }


  deleteUser(userId: number): Observable<boolean> {
    return this.http.delete<void>(`${this.baseUrl}/Users/${userId}`).pipe(
      map(() => true),
      catchError(error => {
        console.error('Error al eliminar el usuario:', error);
        return of(false);
      })
    );
  }


  deleteProfile(userId: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/auth/${userId}`).pipe(
      catchError(error => {
        console.error('Error al eliminar el perfil:', error);
        return throwError(error);
      })
    );
  }

  deleteLogin(userId: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/Users/${userId}`).pipe(
      catchError(error => {
        console.error('Error al eliminar el perfil:', error);
        return throwError(error);
      })
    );
  }








}



