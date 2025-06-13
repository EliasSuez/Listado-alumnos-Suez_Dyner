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
      }
    });

    app.get("/api/alumnos/:id", async (req, res) => {
        const idBuscado = req.params.id
        if(isNaN(idBuscado))
        {
            return res.status(400).json({error: "El id debe ser numerico"})
        }
        try {
            const result = await cliente.query("SELECT * FROM alumnos WHERE id = $1", [idBuscado]);
            if(result.rows.length === 0 ){
                return res.status(404).json({error : "Alumno no enontrado"})
            }
            else{
                return res.status(StatusCodes.OK).json(result.rows);
            }
        }
        catch (error){
            console.error(error)
            return res.status(500).json({error: error.message})
        }
    });

    app.post("/api/alumnos" , async (req, res) => {
        
        const {id, nombre, apellido, id_curso, fecha_nacimiento, hace_deportes} = req.body
        
        app.post("/api/alumnos", async (req, res) => {
            const { nombre, apellido, id_curso, fecha_nacimiento, hace_deportes } = req.body;
          
            // Validaciones de negocio
            if (!nombre || nombre.length < 3) {
              return res.status(400).json({ error: "El nombre es obligatorio y debe tener al menos 3 caracteres" });
            }
          
            if (!apellido || apellido.length < 3) {
              return res.status(400).json({ error: "El apellido es obligatorio y debe tener al menos 3 caracteres" });
            }
          
            if (!id_curso || isNaN(id_curso)) {
              return res.status(400).json({ error: "El id_curso debe ser un número válido" });
            }
          
            if (!fecha_nacimiento) {
              return res.status(400).json({ error: "La fecha de nacimiento es obligatoria" });
            }
          
            const cliente = new Client(config);
          
            try {
              await cliente.connect();
          
              const result = await cliente.query(
                `INSERT INTO alumnos (nombre, apellido, id_curso, fecha_nacimiento, hace_deportes)
                 VALUES ($1, $2, $3, $4, $5)`,
                [nombre, apellido, id_curso, fecha_nacimiento, hace_deportes]
              );
          
              return res.status(201).json(result.rows[0]);
            } catch (error) {
              console.error("Error al insertar alumno:", error);
              return res.status(500).json({ error: error.message });
            } 
          });
        
    });






    app.listen(port, () => {
      console.log(`Servidor escuchando en http://localhost:${port}`);
    });
    } catch (error) {
    console.error("Error conectando a la base de datos:", error);
    }
}

startServer();
