--\l -> list database
--\c nameDB-> move inside database
--\dt -> show tables database
--\i ruta -> cargar archivo sql => /home/xavier/programming/study/web_sample_with_backend/backend/


-- CREATE DATABASE rol_sampleweb;

-- CREATE TABLE professions(
--     id SERIAL PRIMARY KEY,
--     description VARCHAR(255)
-- );


-- # CHECK PRIMARY KEY OF A TABLE
-- SELECT a.attname, format_type(a.atttypid, a.atttypmod) AS data_type
-- FROM   pg_index i
-- JOIN   pg_attribute a ON a.attrelid = i.indrelid
--                      AND a.attnum = ANY(i.indkey)
-- WHERE  i.indrelid = 'table-name'::regclass
-- AND    i.indisprimary;


-- # timestamptz VS timestamp
-- timestamptz -> contiene time zone
-- timestamp -> no contiene time zone


-- # UPDATE MORE THAN 1 COLUMN
-- "UPDATE todo SET description = $1, update_at = now() WHERE id = $2", ['Pruebas de update_at', '067676d8-3a89-421d-b3b6-91fd09e9be53']);



-- -------------------------------
-- ## BD error manege
-- en database.ts
-- si catch que mire que mira si hay las palabras column(not found) o syntax(bad rquest)

-- en service poner una clase para cada tabla en pla todoSercvice extends database

-- return new GeneralErrorResponse(
--                 new InternalServerException(`${err.mensaje}`),
--             ).create();
--             retorna undefined