import dotenv from "dotenv";

const config = {
  host: process.env.DB_HOST ?? "",
  database: process.env.DB_DATABASE ?? "",
  user: process.env.DB_USER ?? "",
  password: process.env.DB_PASSWORD ?? "",
  port: process.env.DB_ROOT ?? 5432,
};

export default config;
