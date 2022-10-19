--\l -> list database
--\c nameDB-> move inside database
--\dt -> show tables database

CREATE DATABASE rol_sampleweb;

CREATE TABLE professions(
    id SERIAL PRIMARY KEY,
    description VARCHAR(255)
);