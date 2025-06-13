CREATE TABLE alumnos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(75) NOT NULL,
    apellido VARCHAR(75) NOT NULL,
    id_curso INT REFERENCES cursos(id),
    fecha_nacimiento DATE,
    hace_deportes BOOLEAN
);