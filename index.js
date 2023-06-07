//Aplicación con Express
const express = require("express");
const app = express();
const fsPromises = require("fs/promises");

// Endpoint de Home
app.get("/", (req, res) => {
    res.send("Endpoint de home mi API esta funcionando CAMBIOANDO nodemon");
});

// Endpoints
/**
 * 1er endpoint
 * Enlistar koders.
 * ARQ REST
 * recurso/identificar
 * method -> GET
 * ruta -> /koders
 *
 */

// List koders
app.get("/koders", async (req, res) => {
    const db = await fsPromises.readFile("./koders.json", "utf8"); // leemos base de datos
    const parsedDB = JSON.parse(db); // parseamos json
    console.log("DB no parseada", db);
    console.log("DB si parseada", parsedDB);
    res.json(parsedDB); // respondemos con header de Content-Type -> application/json
});

// Get Koder by name
/**
 * Query params ->>>> ?modulo=Backend
 * Path params(identificador) ->>>> :name
 */
app.get("/koders/:name", async (req, res) => {
    // Path param
    const { name } = req.params;
    const db = await fsPromises.readFile("./koders.json", "utf8");
    const parsedDb = JSON.parse(db);
    const filteredKoder = parsedDb.koders.filter(
        (koder) => koder.name.toLowerCase() === name.toLowerCase()
    )[0];
    res.json(filteredKoder);
});

//Prendemos nuestro servidor
app.listen(8080, () => {
    console.log("Nuestro servidor esta prendido");
});