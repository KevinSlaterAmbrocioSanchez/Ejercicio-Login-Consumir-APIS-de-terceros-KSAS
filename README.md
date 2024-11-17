#  Login usando APIs

Este documento describe el componente de login implementado con Angular Material, que se conecta a una API externa para validar el inicio de sesión. A continuación, se proporciona una descripción detallada de las partes más relevantes del código.

#### Descripción General

El LoginComponent es un componente independiente de Angular que permite a los usuarios autenticarse a través de un formulario. Este formulario solicita el correo electrónico y la contraseña del usuario, que luego se validan mediante una API externa. El componente está desarrollado usando Angular Material para estilizar el formulario y HttpClient para gestionar las solicitudes HTTP.

#### Estructura del Proyecto

Imports Principales: El componente importa varios módulos de Angular y Angular Material, incluidos MatButtonModule, MatCardModule, HttpClientModule, entre otros. Además, se utiliza ReactiveFormsModule para gestionar el formulario de login.

Formulario de Login: Se crea usando FormGroup y FormControl, estableciendo validaciones para los campos de correo y contraseña.

Conexión con la API: Se realiza una solicitud HTTP a la API https://api.escuelajs.co/api/v1/users para validar las credenciales ingresadas por el usuario.

#### Código Completo

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { signal } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge } from 'rxjs';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    FlexLayoutModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class LoginComponent {
  hide = signal(true);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  errorMessage = signal('');

  constructor(private router: Router, private http: HttpClient) {
    merge(this.loginForm.get('email')!.statusChanges, this.loginForm.get('email')!.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  updateErrorMessage() {
    if (this.loginForm.get('email')?.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.loginForm.get('email')?.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage.set('Por favor, completa todos los campos correctamente.');
      window.alert('Por favor, completa todos los campos correctamente.');
      return;
    }

    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    // Realizar la solicitud HTTP para obtener los usuarios
    this.http.get<any[]>('https://api.escuelajs.co/api/v1/users').subscribe(
      (usuarios) => {
        // Buscar si existe un usuario con el correo y contraseña ingresados
        const usuarioValido = usuarios.find(
          (usuario) => usuario.email === email && usuario.password === password
        );

        if (usuarioValido) {
          // Login exitoso
          console.log('Login exitoso');
          window.alert('Bienvenido, ' + usuarioValido.name);
          this.router.navigate(['/sidebar']);
        } else {
          // Login fallido
          this.errorMessage.set('Correo o contraseña incorrectos.');
          window.alert('Correo o contraseña incorrectos.');
        }
      },
      (error) => {
        console.error('Error al obtener los usuarios:', error);
        this.errorMessage.set('Hubo un problema al iniciar sesión. Por favor, intenta más tarde.');
        window.alert('Hubo un problema al iniciar sesión. Por favor, intenta más tarde.');
      }
    );
  }
}


#### Conexion

##### Conexión con la API

La conexión con la API se realiza utilizando HttpClient de Angular. Para que funcione correctamente, se debe importar HttpClientModule en el módulo o componente donde se vaya a usar. En este caso, se importa directamente en el componente independiente (standalone).


import { HttpClientModule, HttpClient } from '@angular/common/http';
...
imports: [
  ...
  HttpClientModule
]`

Dentro del método onSubmit(), se realiza una solicitud GET a la API para obtener una lista de usuarios y verificar las credenciales proporcionadas por el usuario.

##### Validación de Login

El formulario de login está diseñado usando FormGroup y FormControl para facilitar la validación de los campos. En el método onSubmit(), se comprueba si las credenciales ingresadas por el usuario coinciden con los datos obtenidos de la API. Si el correo electrónico o la contraseña son incorrectos, se muestra un mensaje de error.



onSubmit() {
  if (this.loginForm.invalid) {
    this.errorMessage.set('Por favor, completa todos los campos correctamente.');
    window.alert('Por favor, completa todos los campos correctamente.');
    return;
  }

  const email = this.loginForm.get('email')?.value;
  const password = this.loginForm.get('password')?.value;

  // Realizar la solicitud HTTP para obtener los usuarios
  this.http.get<any[]>('https://api.escuelajs.co/api/v1/users').subscribe(
    (usuarios) => {
      const usuarioValido = usuarios.find(
        (usuario) => usuario.email === email && usuario.password === password
      );

      if (usuarioValido) {
        console.log('Login exitoso');
        window.alert('Bienvenido, ' + usuarioValido.name);
        this.router.navigate(['/sidebar']);
      } else {
        this.errorMessage.set('Correo o contraseña incorrectos.');
        window.alert('Correo o contraseña incorrectos.');
      }
    },
    (error) => {
      console.error('Error al obtener los usuarios:', error);
      this.errorMessage.set('Hubo un problema al iniciar sesión. Por favor, intenta más tarde.');
      window.alert('Hubo un problema al iniciar sesión. Por favor, intenta más tarde.');
    }
  );
}`

------------


#### Cómo Ejecutar el Proyecto

1.-Asegúrate de tener Angular CLI instalado en tu sistema.

2.-Clona el repositorio y navega hasta el directorio del proyecto.

3.-Ejecuta npm install para instalar las dependencias.

4.-Utiliza ng serve para iniciar el servidor de desarrollo y acceder al componente de inicio de sesión.

#### Notas

El código utiliza window.alert() para mostrar mensajes al usuario. En un entorno de producción, se recomienda utilizar componentes más sofisticados para manejar las notificaciones.

### Prueba del LOGIN
![image](https://github.com/user-attachments/assets/ffbda6e6-17ae-4a75-814c-6ab1f8817581)


#### Autor
Ambrocio Sanchéz Kevin Slater
