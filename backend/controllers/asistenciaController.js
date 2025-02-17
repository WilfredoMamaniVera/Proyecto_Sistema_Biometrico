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
      res
        .status(201)
        .json({
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
