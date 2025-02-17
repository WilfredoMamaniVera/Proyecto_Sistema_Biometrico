"# Control de Asistencia Biom�trico"

# Control de Asistencia Biométrico - Backend

Este proyecto es el backend para un sistema de control de asistencia biométrico utilizando Node.js, Express y MySQL (XAMPP). La autenticación se maneja mediante JWT, y la verificación biométrica se realiza en el dispositivo móvil.

## Tabla de Contenidos

- [Requisitos](#requisitos)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación y Configuración](#instalación-y-configuración)
  - [Inicializar el Proyecto](#inicializar-el-proyecto)
  - [Instalar Dependencias](#instalar-dependencias)
  - [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
  - [Conexión a la Base de Datos](#conexión-a-la-base-de-datos)
  - [Servidor Principal](#servidor-principal)
- [Rutas y Controladores](#rutas-y-controladores)
  - [Autenticación](#autenticación)
    - [Rutas](#rutas)
    - [Controlador](#controlador)
  - [Asistencia](#asistencia)
    - [Rutas](#rutas-1)
    - [Controlador](#controlador-1)
- [Middleware de Autenticación](#middleware-de-autenticación)
- [Configuración de la Base de Datos (MySQL)](#configuración-de-la-base-de-datos-mysql)
- [Ejecutar el Servidor](#ejecutar-el-servidor)
- [Pruebas](#pruebas)
- [Acceso Biométrico](#acceso-biométrico)
- [Conclusión](#conclusión)

## Requisitos

- Node.js (versión LTS recomendada)
- MySQL (instalado a través de XAMPP)
- npm

## Estructura del Proyecto

```bash
backend/
├── config/
│   └── db.js                 # Conexión a MySQL
├── controllers/
│   ├── authController.js     # Lógica para registro y login
│   └── asistenciaController.js  # Lógica para registrar y obtener asistencia
├── middlewares/
│   └── authMiddleware.js     # Verificación del token JWT
├── routes/
│   ├── auth.js               # Rutas de autenticación
│   └── asistencia.js         # Rutas para asistencia
├── .env                      # Variables de entorno
├── package.json              # Dependencias y scripts
└── server.js                 # Archivo principal del servidor
```

## 1. Instalación y Configuración

### nicializar el Proyecto

En la terminal, crea la carpeta y ejecuta:

```sh
mkdir backend
cd backend
npm init -y
npm install express mysql2 cors dotenv jsonwebtoken bcryptjs
```

## 2. Configuración de Variables de Entorno

Crea un archivo .env en la raíz con el siguiente formato:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=control_acceso
JWT_SECRET=tu_clave_secreta
PORT=5000
```

## 3. Conexión a la Base de Datos MySQL

Crea el archivo config/db.js y pega el siguiente código:

```js
// config/db.js
const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error("Error conectando a MySQL:", err);
    return;
  }
  console.log("Conectado a la base de datos MySQL.");
});

module.exports = connection;
```

## 4. Servidor Principal

Crea el archivo server.js y coloca el siguiente código:

```js
// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json()); // Permite recibir JSON en las peticiones

// Importar rutas
const authRoutes = require("./routes/auth");
const asistenciaRoutes = require("./routes/asistencia");

app.use("/auth", authRoutes);
app.use("/asistencia", asistenciaRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
```

## Base de Datos

Crear la Base de Datos y Tablas
Abre phpMyAdmin (a través de XAMPP) y crea una base de datos llamada control_acceso.
Crea la tabla usuarios y la table asistencia:

```sql
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE asistencia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    timestamp DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES usuarios(id)
);

```

Endpoints
Rutas de Autenticación
Crea routes/auth.js:

```js
const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
```

tambien creamos el controllers/authController.js

```
const connection = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = (req, res) => {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password) {
        return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ error: "Error al encriptar la contraseña" });
        }
        connection.query(
            "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)",
            [nombre, email, hashedPassword],
            (error, results) => {
                if (error) return res.status(500).json({ error: error.message });
                res.status(201).json({ message: "Usuario registrado correctamente", userId: results.insertId });
            }
        );
    });
};

exports.loginUser = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email y contraseña son requeridos" });
    }

    connection.query("SELECT * FROM usuarios WHERE email = ?", [email], (error, results) => {
        if (error) return res.status(500).json({ error: error.message });
        if (results.length === 0) return res.status(401).json({ error: "Usuario no encontrado" });

        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err || !isMatch) return res.status(401).json({ error: "Contraseña incorrecta" });
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
            res.json({ token, user: { id: user.id, nombre: user.nombre, email: user.email } });
        });
    });
};

```

## Rutas de Asistencia

Crea routes/asistencia.js:

```js
const express = require("express");
const {
  registrarAsistencia,
  obtenerAsistencias,
} = require("../controllers/asistenciaController");
const { verificarToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", verificarToken, registrarAsistencia);
router.get("/", verificarToken, obtenerAsistencias);

module.exports = router;
```

Y el controlador controllers/asistenciaController.js:

```js
const connection = require("../config/db");

exports.registrarAsistencia = (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "El ID de usuario es requerido" });
  }
  const timestamp = new Date();

  connection.query(
    "INSERT INTO asistencia (user_id, timestamp) VALUES (?, ?)",
    [userId, timestamp],
    (error, results) => {
      if (error) return res.status(500).json({ error: error.message });
      res.status(201).json({
        message: "Asistencia registrada correctamente",
        asistenciaId: results.insertId,
      });
    }
  );
};

exports.obtenerAsistencias = (req, res) => {
  connection.query("SELECT * FROM asistencia", (error, results) => {
    if (error) return res.status(500).json({ error: error.message });
    res.json(results);
  });
};
```

## Middleware de Autenticación

Crea middlewares/authMiddleware.js:

```js
const jwt = require("jsonwebtoken");

exports.verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token requerido" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido" });
  }
};
```

## Acceso Biométrico

La autenticación biométrica se implementa en el dispositivo móvil (React Native). La app utiliza APIs nativas (por ejemplo, con react-native-fingerprint-scanner o expo-local-authentication) para validar la huella digital.
Una vez validado el usuario en el dispositivo, la app puede llamar al endpoint /auth/login para obtener un token JWT. Este token se envía en el header Authorization para acceder a los endpoints protegidos, como /asistencia.

Importante: Los datos biométricos (la huella) se validan localmente en el dispositivo y no se envían al backend.

## Ejecutar el Servidor

Asegúrate de que MySQL (XAMPP) esté en ejecución.
Desde la carpeta backend, ejecuta:

```sh
node server.js
```

deverias ver lo siguiente:

```sh
Conectado a la base de datos MySQL.
Servidor corriendo en http://localhost:5000

```

## Prueba de la API

Utiliza herramientas como Postman
Registro de Usuario:

```
POST http://localhost:5000/auth/register

{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "123456"
}

```

Login de Usuario:

```
POST http://localhost:5000/auth/login

{
  "email": "juan@example.com",
  "password": "123456"
}

```

## Conclusion

Este backend implementa un sistema de control de asistencia biométrico utilizando Node.js, Express y MySQL. La autenticación se maneja con JWT, y la verificación biométrica se realiza en el dispositivo móvil, donde la app recibe un token que se utiliza para acceder a la API protegida.
