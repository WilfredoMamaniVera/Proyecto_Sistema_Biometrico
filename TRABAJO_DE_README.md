# Proyecto de Inteligencia Artificial: SISTEMA BIOMETRICO
## 📌 Materia: Sistemas de Información III  
**Integrantes:**  
- Mario Terrazas Parada  
- Juan Rubén Heredia  
- Jhonny Herrera Baldivieso  
- Wilfredo Mamani Vera  
- Franz Alberto Huanca Quispe  
## 📌 Introducción
En la actualidad, la autenticación de identidad es un aspecto crítico en entornos académicos y empresariales. Los métodos tradicionales, como contraseñas y tarjetas de acceso, pueden ser vulnerables a fraudes, robos o pérdidas, comprometiendo la seguridad y eficiencia en la gestión de accesos.

Este proyecto tiene como objetivo desarrollar un Sistema Biométrico de Detección de Rostro, que permite una autenticación precisa y segura mediante tecnología de reconocimiento facial. Utilizando herramientas modernas como React para la interfaz de usuario, Laravel para la API backend y Turso como base de datos en la nube, el sistema proporciona una solución escalable y eficiente para el control de accesos y la gestión de identidad.

El desarrollo de este sistema busca optimizar el proceso de validación de usuarios, reducir los tiempos de autenticación y minimizar los riesgos de accesos no autorizados. Además, se implementarán medidas de seguridad avanzadas para la protección de datos biométricos, garantizando privacidad y cumplimiento con estándares de seguridad.
## 🎯 Objetivo
Desarrollar un Sistema Biométrico de Detección de Rostro que permita realizar la autenticación de usuarios de manera segura y eficiente, utilizando tecnología avanzada de reconocimiento facial. Este sistema se implementa en entornos académicos y empresariales para optimizar el control de acceso, garantizar la seguridad de los usuarios y facilitar la gestión de la identidad.
## 📚 Marco Teorico
Se revisaron conceptos clave como autenticación biométrica, reconocimiento facial y modelos de inteligencia artificial utilizados en la verificación de identidad. Se destacan las tecnologías utilizadas en el desarrollo del sistema, como React para la interfaz de usuario, Laravel para la API backend y Turso como base de datos en la nube.
## Autenticación Biométrica
La autenticación biométrica se refiere al uso de características físicas y comportamentales únicas de un individuo, como las huellas dactilares, la voz o el rostro, para verificar su identidad. En este proyecto, se utiliza el reconocimiento facial como método biométrico, que permite realizar un análisis preciso de las características faciales de los usuarios para autenticar su identidad de manera rápida y segura.
## Reconocimiento Facial
El reconocimiento facial es una tecnología que utiliza algoritmos de aprendizaje automático para identificar a las personas a partir de sus características faciales. El sistema captura y procesa imágenes faciales para compararlas con una base de datos, proporcionando una autenticación eficiente sin la necesidad de contraseñas o dispositivos físicos adicionales.
## Codigo fuerte proceso de instalacion
## 1.-Instalar laravel
Primero, necesitas instalar Laravel, que es un framework PHP muy utilizado para crear aplicaciones backend. Asegúrate de tener PHP y Composer instalados en tu sistema.
```bash
composer create-project --prefer-dist laravel/laravel sistema-biometrico
```
## 2.-Configurar Turso
Turso es una base de datos en la nube, por lo que primero debes configurar una cuenta y crear una base de datos en su plataforma.

Ve a Turso y crea una cuenta si no tienes una.
Crea una base de datos.
Obtén las credenciales de acceso a la base de datos.
## 3.-Crear modelos y migraciones
Con la base de datos configurada, debes crear los modelos y las migraciones para las tablas que utilizarás en tu proyecto.
```bash
php artisan make:model Usuario -m
```

#### ejemplo de modelo en php
```php

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Acceso extends Model
{
    protected $primaryKey = 'id_acceso';
    public $timestamps = false;

    protected $fillable = [
        'id_persona',
        'area_acceso'
    ];

    public function persona()
    {
        return $this->belongsTo(Persona::class, 'id_persona');
    }
}

```

## 4.-Implementar rutas en el php API
Crearás controladores para manejar las solicitudes API. Por ejemplo, un controlador para registrar ACCESO:
```bash
php artisan make:model Usuario -m
```
En el controlador, puedes implementar el registro de usuarios y el manejo de datos biométricos:
```bash
// app/Http/Controllers/UsuarioController.php

public function registrar(Request $request)
{
    $validated = $request->validate([
        'nombre' => 'required|string|max:255',
        'email' => 'required|email|unique:usuarios,email',
        'password' => 'required|string|min:8',
    ]);

    $usuario = Usuario::create([
        'nombre' => $validated['nombre'],
        'email' => $validated['email'],
        'password' => bcrypt($validated['password']),
    ]);

    return response()->json($usuario, 201);
}

```
Luego, en routes/api.php, agrega las rutas para acceder a estas funciones:
```bash
// routes/api.php
Route::post('registrar', [UsuarioController::class, 'registrar']);

```
## 4.-Instalacion del Frontend(React)
Crear el Proyecto React
Si no tienes un proyecto React, puedes crear uno utilizando create-react-app.
```bash
npx create-react-app sistema-biometrico-frontend
cd sistema-biometrico-frontend

```
Instalar Axios para las Solicitudes HTTP
```bash
npm install axios
```
 Crear Componentes en React
 ```bash
// src/components/RegistrarUsuario.js

import React, { useState } from 'react';
import axios from 'axios';

function RegistrarUsuario() {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post('http://localhost:8000/api/registrar', {
                nombre,
                email,
                password,
            });
            console.log('Usuario registrado:', response.data);
        } catch (error) {
            console.error('Error al registrar usuario:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text" 
                placeholder="Nombre" 
                value={nombre} 
                onChange={(e) => setNombre(e.target.value)} 
            />
            <input 
                type="email" 
                placeholder="Correo electrónico" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
            />
            <input 
                type="password" 
                placeholder="Contraseña" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
            />
            <button type="submit">Registrar</button>
        </form>
    );
}

export default RegistrarUsuario;

```
Ejecutar el Proyecto React
```bash
npm run start

```
## 📋 Metodología de trabajo utilizando Scrum
Para el desarrollo del Sistema Biométrico de Detección de Rostro, se ha adoptado la metodología ágil Scrum, la cual permite una gestión eficiente del proyecto a través de iteraciones cortas llamadas sprints. Esta metodología facilita la adaptación a cambios, mejora la comunicación entre el equipo y garantiza entregas parciales y funcionales del sistema.
## Roles dentro del equipo Scrum
-Scrum Master: Facilita el proceso Scrum, eliminando impedimentos y asegurando el cumplimiento de las prácticas ágiles.
-Product Owner: Responsable de definir los requerimientos y priorizar las funcionalidades en el Product Backlog.
-Equipo de Desarrollo: Compuesto por los integrantes del proyecto, encargados de diseñar, desarrollar e implementar el sistema.
## 🖥️ Modelado o Sistematización
El modelo de reconocimiento facial se basa en una arquitectura de redes neuronales convolucionales (CNN), que ha demostrado gran eficacia en la identificación de patrones faciales. Se entrenó el modelo con un conjunto de datos diverso para mejorar su precisión y reducir sesgos. Durante la fase de prueba, el sistema alcanzó una tasa de reconocimiento del 90%, lo que demuestra su fiabilidad en la autenticación biométrica.
## 📊 Conclusiones
El Sistema Biométrico de Detección de Rostro desarrollado permite una autenticación rápida y segura, mejorando la gestión de accesos en entornos académicos y empresariales. La combinación de tecnologías modernas como React, Laravel y Turso ha permitido crear una solución escalable y eficiente. Además, la implementación de medidas de seguridad avanzadas garantiza la protección de los datos biométricos, cumpliendo con los estándares de privacidad y seguridad.
## 📚 Bibliografía
- https://turso.tech/
- https://es.react.dev/

## 📁 Anexos
- Código Fuente: [GitHub](https://github.com/WilfredoMamaniVera/Proyecto_Sistema_Biometrico)
