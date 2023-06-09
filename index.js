const express = require("express");
const app = express();
const fsPromises = require("fs/promises");

//Middleware (en todos los endpoints)
//Parsear todo lo que el cliente me manda a Json
app.use(express.json())

// Endpoint de Home
app.get("/", (req, res) => {
    res.send("Endpoint de home mi API esta funcionando CAMBIOANDO nodemon");
});

// Endpoints
/**
 * 1er endpoint
    * Enlistar koders.
 * ARQ REST
    * recurso/identificar (/koders/Identificador) -> koder en específico
    * method -> GET
    * ruta -> /koders (Todos los koders)
 *
 */

/**
 * - En el lado de backend -
 * Path params -> modifican la ruta agregando :pathParam
 * Query params -> no modifican la ruta
 * 
 * - En el lado del cliente(google chrome, insomnia, postman);
 * Path params -> /recurso/pathParam/recurso/pathParam
 * Query Params -> /recurso?pathParam=valor  (Para Filtrar)
 *    ? -> vamos a poner query params
 *    & -> concatenamos query params
 */


// List koders
// === con Query Param ===
app.get("/koders", async (req, res) => {
    const { module } = req.query;
    console.log("req.query", req.query)
    const db = await fsPromises.readFile("./koders.json", "utf8"); // leemos base de datos
    const parsedDB = JSON.parse(db); // parseamos json, ya que nos aparece como String en la BD.
    const filteredKoders = parsedDB.koders.filter(koder => module === koder.module)
    // Esta vacio, no filtra
    if(filteredKoders.length === 0) {
        res.json(parsedDB.koders)
    } else {
        res.json(filteredKoders); // respondemos con header de Content-Type -> application/json
    }
});

// Get Koder by name
/**
    * Query params ->>>> ?modulo=Backend (Para traer varios datos filtrados)
    * Path params (Para identificador) ->>>> :name (Traer un recurso en específico)
 * 
 * ?postId=2
 */


//Get Koder
//Con Path Param (Nuevo endpoint)
/* app.get("/koders/:name", async (req, res) => {
    // Path param
    const { name } = req.params; //Accediendo al Objeto
    const db = await fsPromises.readFile("./koders.json", "utf8");
    const parsedDb = JSON.parse(db); //Parseamos a Json la BD
    const filteredKoder = parsedDb.koders.filter(
        (koder) => koder.name.toLowerCase() === name.toLowerCase()
    )[0]; //Regresa solo el objeto buscado
    res.json(filteredKoder);
}); */

//Get koder by "id"
//Con Path Param (Nuevo endpoint)
app.get("/koders/:id", async (req, res) => {
    // Path param
    const { id } = req.params; //Accediendo al Objeto
    console.log("tipo de dato de id", typeof id);
    const db = await fsPromises.readFile("./koders.json", "utf8");
    const parsedDb = JSON.parse(db); //Parseamos a Json la BD
    const filteredKoder = parsedDb.koders.filter(
        (koder) => koder.id === parseInt(id)
    )[0]; //Regresa solo el objeto buscado
    res.json(filteredKoder);
});

// List mentors (age) (Arquitectura rest)
app.get("/mentors", async (req, res) => {
  const { age } = req.query; 
  const db = await fsPromises.readFile("./koders.json", "utf8");
  const parsedDb = JSON.parse(db);
  // Ya tenemos a todos los mentors
  if(!age) {
      res.json(parsedDb.mentors)
      return; //Para que no "crashee" la aplicación
  }
  // Continuamos
  const filteredMentors = parsedDb.mentors.filter(mentor => mentor.age === age);
  // Si encontro mentors con el query param de age
  if(filteredMentors.length > 0) {
      res.json(filteredMentors);
  // Que filtro, pero no encontro ningun mentor
  } else {
      res.json({ message: "El mentor con esa edad no fue encontrado "});
  }
})

// Crear un koder -> /koders
app.post("/koders", async (req, res) => {
  // Acceso a la base de datos
  const db = await fsPromises.readFile("./koders.json", "utf8");
  const parsedDb = JSON.parse(db);
  // Crear nuestro objeto nuevo
  const koder = {
      id: parsedDb.koders.length + 1,
      ...req.body
  }
  // Agregarlo a nuestra ya creada bd
  parsedDb.koders.push(koder);
  // @ts-ignore
  // Agregarlo a la base de datos
  await fsPromises.writeFile("./koders.json", JSON.stringify(parsedDb, "\n", 4));

  // Response al cliente con nuestro objeto creado,  por si lo llega a necesitar
  res.json(koder)
});

//Actualizar koder
// Modificar un koder -> /koders
app.patch("/koders/:id", async (req, res) => {
   //parametros
   const { id } = req.params; 
  // Acceder a la base de datos
  const db = await fsPromises.readFile("./koders.json", "utf8");
  const parsedDb = JSON.parse(db);
  // Traer el valor que queremos modificar
  const index = parsedDb.koders.findIndex(koder => koder.id === parseInt(id))
  console.log("Indice", index);
//Crear nuestro objeto nuevo
const updateKoder = {
    ... parsedDb.koders[index], //ponme todo lo que ya tengas
    ...req.body // agregame lo nuevo
}
// Actualizamos con el indice la base de datos
parsedDb.koders[index] = updateKoder
  // @ts-ignore
  // Escribimos ya actualizada en nuestra base de datos
  await fsPromises.writeFile("./koders.json", JSON.stringify(parsedDb, "\n", 4));

  // Response con el koder actualizado
  res.json(updateKoder)
});

//Delete Koder con id  en Path Params
app.delete("/koders:/id", async (req, res) => {
    const { id } = req.params;
    const db = await fsPromises.readFile("./koders.json", "utf8");
    const parsedDb = JSON.parse(db);
    const index = parsedDb.koders.findIndex(koder => koder.id === parseInt(id))
    if (index === -1) {
        res.json({message: `id: ${id} no encontrado`})
        return
    } else {
        parsedDb.koders.splice(index, 1);
    }
    await fsPromises.writeFile("./koders.json", JSON.stringify(parsedDb, "\n", 4));
    res.json({ message: `koder con id: ${id} ha sido eliminado`})
})

app.listen(8080, () => {
    console.log("Nuestro servidor esta prendido");
});


/**
 * Ejercicio
 * 2 endpoints -
 * 1.er Donde me filtren por age los mentores []
 * 2.do Donde obtengamos un mentor en especifico con su nombre
 */

/**
 * Ejercicio
 * 1 endpoint
 * Quiero actualizar un koder
 * 
 * method
 * ruta
 * metodos recomendados
 * -> findIndex, find
 */

