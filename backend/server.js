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
