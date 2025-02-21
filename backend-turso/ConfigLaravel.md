# Proyecto Backend con Laravel 11 y Turso

Este proyecto utiliza Laravel 11 y Turso como base de datos para gestionar usuarios y accesos.

## 1. Crear el Proyecto

Ejecuta los siguientes comandos para crear un nuevo proyecto Laravel e instalar el paquete de Turso:

```bash
composer create-project laravel/laravel backend-turso "11.*"
cd backend-turso
composer require richan-fongdasen/turso-laravel
php artisan vendor:publish --provider="RichanFongdasen\Turso\TursoLaravelServiceProvider"
```

Esto generará los siguientes archivos:

-   `config/turso-laravel.php`: Archivo de configuración de Turso.
-   `turso-sync.mjs`: Script para la sincronización con Turso.

## 2. Instalar Dependencias

Instala el cliente de Turso para la conexión con la base de datos:

```bash
npm install @libsql/client
```

## 3. Crear Migraciones

Ejecuta los siguientes comandos para crear las migraciones de las tablas `usuarios` y `accesos`:

```bash
php artisan make:migration create_usuarios_table --create=usuarios
php artisan make:migration create_accesos_table --create=accesos
```

Luego, edita los archivos generados en `database/migrations` para definir la estructura de las tablas.

## 4. Crear Modelos

Genera los modelos de `Usuario` y `Acceso`:

```bash
php artisan make:model Usuario
php artisan make:model Acceso
```

Modifica los archivos generados en `app/Models` según sea necesario.

## 5. Crear Controladores

Crea los controladores para gestionar usuarios y accesos:

```bash
php artisan make:controller UsuarioController
php artisan make:controller AccesoController
```

Luego, implementa la lógica en los archivos generados en `app/Http/Controllers`.

## 6. Configurar Rutas

Si las rutas no se crean automáticamente en `routes/api.php`, agrégalas manualmente. También revisa:

-   `App/Providers/RouteServiceProvider.php`
-   `bootstrap/app.php`

para asegurarte de que todo está correctamente configurado.

## 7. Configurar Base de Datos

Agrega la URL y el token de la base de datos Turso en los archivos `.env` y `.env.example`. Luego, modifica `config/database.php` para definir la conexión con Turso.

## 8. Ejecutar Migraciones

Corre las migraciones para aplicar los cambios en la base de datos:

```bash
php artisan migrate
php artisan migrate:refresh
```

## 9. Crear Enlace Simbólico para Almacenamiento Local

Si tienes problemas con el almacenamiento de archivos, ejecuta:

```bash
php artisan storage:link
```

## 10. Iniciar el Servidor de Laravel

Para iniciar el servidor de desarrollo:

```bash
php artisan serve
```

## 11. Solución de Problemas

Si encuentras errores, prueba estos comandos:

```bash
php artisan route:list
php artisan route:clear
php artisan cache:clear
```

## 12. Probar la API con Insomnia o Postman

### Obtener lista de usuarios

```http
GET http://127.0.0.1:8000/api/usuarios
```

### Crear un nuevo usuario (form-data)

```http
POST http://127.0.0.1:8000/api/usuarios
```

Campos:

-   `nombre` (Text) Ejemplo: "Juan"
-   `apellido_paterno` (Text) Ejemplo: "Pérez"
-   `apellido_materno` (Text, opcional) Ejemplo: "García"
-   `fecha_nacimiento` (Text) Ejemplo: "1990-01-01"
-   `telefono` (Text, opcional) Ejemplo: "1234567890"
-   `correo` (Text) Ejemplo: "juan\@example.com"
-   `imagen_biometrica` (File) Adjunta un archivo de imagen

### Registrar un acceso (JSON)

```json
{
    "id_usuario": 1,
    "tipo_acceso": "entrada",
    "area_acceso": "Recepción"
}
```

Envía este JSON en una solicitud `POST` a:

```http
POST http://127.0.0.1:8000/api/accesos
```
