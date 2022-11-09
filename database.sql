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
-- // server.app.post("/todo", async(req, res) => {
-- //     try {
-- //         const {description} = req.body;
-- //         const newTodo = await pool.query('INSERT INTO todo (description) VALUES ($1) RETURNING *', [description]);

-- //         res.json(newTodo.rows[0])
-- //         console.log(newTodo.rows[0])
-- //     } catch (err) {
-- //         console.error(err)
-- //     }
-- // })

-- // server.app.get("/todo", async(req, res)=>{
-- //     try {
-- //     const allTodos = await pool.query("SELECT * FROM todo")

-- //     res.json(allTodos.rows)

-- //     } catch (err) {
-- //         console.error(err)
-- //     }
-- // })

-- // server.app.get("/todo/:id", async(req, res)=>{
-- //     try {
-- //         // lo que se ponga en la ruta (:id) sera la clave del objeto, si :cosa y se busca cotche te vendra un objeto con, {cosa: cocthe}
-- //         const {id} = req.params

-- // const todo = await pool.query("SELECT * FROM todo WHERE id = $1", [id])

-- //         res.json(todo.rows[0])

-- //     } catch (err) {
-- //         console.error(err)
-- //     }
-- // })

-- // server.app.put("/todo/:id", async(req, res)=>{
-- //     try {
-- //         const {id} = req.params // WHERE

-- //         const {description} = req.body // SET

-- //         const updateTodo = await pool.query("UPDATE todo SET description = $1 WHERE id = $2", [description, id])

-- //         res.json('Todo was updated')

-- //     } catch (err) {
-- //         console.error(err)
-- //     }
-- // })

-- // server.app.delete("/todo/:id", async(req, res)=>{
-- //     try {
-- //         const {id} = req.params // WHERE

-- //         const deleteTodo = await pool.query("DELETE FROM todo WHERE id = $1", [id])

-- //         res.json('Todo was susccesfully deleted')

-- //     } catch (err) {
-- //         console.error(err)
-- //     }
-- // })
