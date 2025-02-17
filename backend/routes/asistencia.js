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
