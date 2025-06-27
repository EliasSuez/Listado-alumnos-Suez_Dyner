import pkg from "pg";
import config from "./db-configs.js";

const { Pool } = pkg;
const pool = new Pool(config);

export default pool;
