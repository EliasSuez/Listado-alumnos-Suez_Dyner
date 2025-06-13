import express from "express";
import cors from "cors";
import { StatusCodes } from "http-status-codes";
import config from "./src/configs/db-configs.js";
import pkg from "pg";

const { Client } = pkg;
const cliente = new Client(config);

const app = express();
const port = 8081;

app.use(cors());
app.use(express.json());

async function startServer() {
  try {
    await cliente.connect();
    console.log("Conectado a la base de datos");

    app.get("/api/alumnos", async (req, res) => {
      try {
        const result = await cliente.query("SELECT * FROM alumnos");
        return res.status(StatusCodes.OK).json(result.rows);
      } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
      } finally{
        await cliente.end()
      }
    });

    // Resto de endpoints igual...

    app.listen(port, () => {
      console.log(`Servidor escuchando en http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error conectando a la base de datos:", error);
  }
}

startServer();
