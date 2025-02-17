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
      return res
        .status(500)
        .json({ error: "Error al encriptar la contraseña" });
    }
    connection.query(
      "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)",
      [nombre, email, hashedPassword],
      (error, results) => {
        if (error) return res.status(500).json({ error: error.message });
        res
          .status(201)
          .json({
            message: "Usuario registrado correctamente",
            userId: results.insertId,
          });
      }
    );
  });
};

exports.loginUser = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email y contraseña son requeridos" });
  }

  connection.query(
    "SELECT * FROM usuarios WHERE email = ?",
    [email],
    (error, results) => {
      if (error) return res.status(500).json({ error: error.message });
      if (results.length === 0)
        return res.status(401).json({ error: "Usuario no encontrado" });

      const user = results[0];
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err || !isMatch)
          return res.status(401).json({ error: "Contraseña incorrecta" });
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        res.json({
          token,
          user: { id: user.id, nombre: user.nombre, email: user.email },
        });
      });
    }
  );
};
