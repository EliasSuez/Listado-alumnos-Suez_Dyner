import express from "express";
import cors from "cors";
import { StatusCodes } from "http-status-codes";
import config from "./src/configs/db-configs.js";
import pkg from "pg";
import alumnosRouter from "./src/routes/alumnos.js";


const { Pool } = pkg;
const pool = new Pool(config);

const app = express();
const port = 8081;

app.use(cors());
app.use(express.json());

app.use("/api/alumnos", alumnosRouter);

async function startServer() {
  try {
    console.log("Conectado a la base de datos");

    alumnosRouter.get("/", async (req, res) => {
      try {
        const result = await pool.query("SELECT * FROM alumnos");
        return res.status(StatusCodes.OK).json(result.rows);
      } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
      }
    });

    alumnosRouter.get("/:id", async (req, res) => {
        const idBuscado = req.params.id
        if(isNaN(idBuscado))
        {
            return res.status(StatusCodes.BAD_REQUEST).json({error: "El id debe ser numerico"})
        }
        try {
            const result = await pool.query("SELECT * FROM alumnos WHERE id = $1", [idBuscado]);
            if(result.rows.length === 0 ){
                return res.status(StatusCodes.NOT_FOUND).json({error : "Alumno no enontrado"})
            }
            else{
                return res.status(StatusCodes.OK).json(result.rows);
            }
        }
        catch (error){
            console.error(error)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: error.message})
        }
    });

    app.post("/api/alumnos", async (req, res) => {
        const { nombre, apellido, id_curso, fecha_nacimiento, hace_deportes } = req.body;
      
        if (!nombre || nombre.length < 3) {
          return res.status(StatusCodes.BAD_REQUEST).json({ error: "El nombre es obligatorio y debe tener al menos 3 caracteres" });
        }
        if (!apellido || apellido.length < 3) {
          return res.status(StatusCodes.BAD_REQUEST).json({ error: "El apellido es obligatorio y debe tener al menos 3 caracteres" });
        }
        if (!id_curso || isNaN(id_curso)) {
          return res.status(StatusCodes.BAD_REQUEST).json({ error: "El id_curso debe ser un número válido" });
        }
        if (!fecha_nacimiento) {
          return res.status(StatusCodes.BAD_REQUEST).json({ error: "La fecha de nacimiento es obligatoria" });
        }
      
        try {
          const result = await pool.query(
            `INSERT INTO alumnos (nombre, apellido, id_curso, fecha_nacimiento, hace_deportes)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [nombre, apellido, id_curso, fecha_nacimiento, hace_deportes]
          );
          return res.status(StatusCodes.CREATED).json(result.rows[0]);
        } catch (error) {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    });
      

    app.put("/api/alumnos", async (req, res) => {
        const { id, nombre, apellido, id_curso, fecha_nacimiento, hace_deportes } = req.body;
        console.log("PUT /api/alumnos request received", req.body);
        if (!id || isNaN(id)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "El id es obligatorio y debe ser un número válido" });
        }
        if (!nombre || nombre.length < 3) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "El nombre es obligatorio y debe tener al menos 3 caracteres" });
        }
        if (!apellido || apellido.length < 3) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "El apellido es obligatorio y debe tener al menos 3 caracteres" });
        }
        if (!id_curso || isNaN(id_curso)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "El id_curso debe ser un número válido" });
        }
        if (!fecha_nacimiento) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "La fecha de nacimiento es obligatoria" });
        }
        
        try {
            const check = await pool.query("SELECT * FROM alumnos WHERE id = $1", [id]);
        
            if (check.rows.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "Alumno no encontrado" });
            }
        
            const result = await pool.query(
            `UPDATE alumnos
                SET nombre = $1, apellido = $2, id_curso = $3, fecha_nacimiento = $4, hace_deportes = $5
                WHERE id = $6
                RETURNING *`,
            [nombre, apellido, id_curso, fecha_nacimiento, hace_deportes, id]
            );
        
            return res.status(StatusCodes.CREATED).json(result.rows[0]);
        } catch (error) {
            console.error("Error actualizando alumno:", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
        });
            
    app.delete("/api/alumnos/:id", async (req, res) => {
        const id = req.params.id;
    
        if (isNaN(id)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "El id debe ser un número válido" });
        }
    
        try {
        const check = await pool.query("SELECT * FROM alumnos WHERE id = $1", [id]);
    
        if (check.rows.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "Alumno no encontrado" });
        }

        await pool.query("DELETE FROM alumnos WHERE id = $1", [id]);
    
        return res.status(StatusCodes.OK).json({ message: "Alumno eliminado correctamente" });
        } catch (error) {
        console.error("Error eliminando alumno:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
      });
      



    app.listen(port, () => {
      console.log(`Servidor escuchando en http://localhost:${port}`);
    });
    } catch (error) {
    console.error("Error conectando a la base de datos:", error);
    }
}

startServer();
