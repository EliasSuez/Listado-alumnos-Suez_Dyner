import express from "express";
import { StatusCodes } from "http-status-codes";
import pool from "../configs/pool.js"; 

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM alumnos");
    res.status(StatusCodes.OK).json(result.rows);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
});

export default router;
