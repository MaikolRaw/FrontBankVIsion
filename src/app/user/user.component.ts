import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserServiceService } from '../services/user-service.service';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';


import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule,],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {

  private userIdLogin: any

  loginSucces: boolean = false;
  dataPerfil: any = [];
  showRegister = false;
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  updateForm!: FormGroup;
  router: any;

  constructor(
    private userServ: UserServiceService,
    private fb: FormBuilder,

  ) { }

  ngOnInit() {
    this.loginSucces = false;
    this.loginForm = this.fb.group({
      userId: ['', Validators.required], // Agrega Validators.required aquí
      password: ['', [Validators.required]] // Agrega Validators.required aquí
    });

    this.registerForm = this.fb.group({
      identificationType: ['', Validators.required],
      userId: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.updateForm = this.fb.group({
      userId: ['', Validators.required],
      identificationType: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],

    });

  }

  login(): void {

    const { userId, password } = this.loginForm.value;

    // Llamada al servicio para iniciar sesión
    this.userServ.login(userId, password).subscribe(
      (success) => {
        if (success) {
          alert("Inicio de sesión exitoso.")
          this.loginSucces = true;
          this.userIdLogin = userId;
          this.obtenerPerfil(this.userIdLogin);
          this.loginForm.reset();
        } else {
          this.loginSucces = false;

          alert("Credenciales incorrectas, por favor inténtelo de nuevo.")

        }
      },
      (error) => {
        console.error('Ocurrió un error al iniciar sesión, por favor inténtelo de nuevo.:', error);
        alert("Ocurrió un error al iniciar sesión, por favor inténtelo de nuevo.")

      }
    );
  }


  register() {
    /* if (this.registerForm.invalid) {
      // Mostrar mensaje de error al usuario
      alert('Por favor, llene todos los campos.');
      return; // Detener la ejecución si hay campos faltantes
    } */

    // Validar la contraseña
    if (!this.validatePassword(this.registerForm.value.password)) {
      return; // Detener la ejecución si la contraseña no es válida
    }

    // Continuar con el registro del usuario
    this.userServ.createUser(this.registerForm.value)
      .subscribe(
        (response) => {
          alert("Usuario creado exitosamente.")


          // Llamar al servicio para crear el login
          this.userServ.createLogin({
            userId: this.registerForm.value.userId,
            password: this.registerForm.value.password
          }).subscribe(
            (loginResponse) => {
              alert("Login creado exitosamente.")

              this.registerForm.reset();
              this.showRegister = false;
              // Lógica adicional después de crear el login (si es necesario)
            },
            (loginError) => {
              alert("Error al crear el login.")
              console.error('Error al crear el login:', loginError);


            }
          );
          // Lógica adicional después de crear el usuario (si es necesario)
        },
        (error) => {
          alert("Error al crear el usuario.")
          console.error('Error al crear el usuario:', error);
          // Manejo de errores del usuario
        }
      );
  }

  validatePassword(password: string) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(password)) {
      alert('La contraseña debe tener al menos una mayúscula, un carácter especial, un número y una longitud mínima de 8 caracteres.');
      return false;
    }
    return true;
  }






  toggleRegister() {
    this.showRegister = !this.showRegister;
  }



  obtenerPerfil(userId: string) {
    const data = { userId: userId };
    this.userServ.getUser(data).subscribe(
      response => {

        this.updateForm.patchValue({
          identificationType: response.identificationType,
          userId: response.userId,
          dateOfBirth: response.dateOfBirth,
          phoneNumber: response.phoneNumber,
          email: response.email
        });
      },
      error => {
        console.error('Error al obtener el perfil', error);
      }
    );
  }


  actualizarPerfil(): void {


    /*  if (this.updateForm.valid) { */
    this.userServ.updateUsers(this.updateForm.value).subscribe(
      response => {
        alert("Perfil actualizado correctamente.");
      },
      error => {
        alert("Error al actualizar el perfil.");
        console.error('Error al actualizar el perfil', error);
      }
    );
    /*    } else {
         alert("Por favor, complete todos los campos del formulario.");
       } */
  }




  cerrarSesion(): void {
    this.loginSucces = false;
  }

  deleteUser() {
    // Eliminar usuario de la colección "Users"
    this.userServ.deleteUser(this.userIdLogin).subscribe(
      response => {
        if (response) {
          // Eliminar usuario de la colección "Login" solo si se eliminó el usuario de "Users"
          this.userServ.deleteLogin(this.userIdLogin).subscribe(
            loginResponse => {
              if (loginResponse) {
                alert("Perfil eliminado correctamente.");
                // Forzar recarga de la página para eliminar caché
                window.location.reload();

              } else {
                alert("Error al eliminar el perfil.");
              }
            },
            error => {
              alert("Error al eliminar el perfil.");
              console.error('Error al eliminar el perfil', error);
            }
          );
        } else {
          alert("Error al eliminar el perfil.");
        }
      },
      error => {
        alert("Error al eliminar el perfil.");
        console.error('Error al eliminar el perfil', error);
      }
    );
  }







}
