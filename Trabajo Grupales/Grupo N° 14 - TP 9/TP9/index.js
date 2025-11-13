// index.js - Punto de entrada del servidor
require("dotenv").config();
const app = require("./src/app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor activo en puerto ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
});
