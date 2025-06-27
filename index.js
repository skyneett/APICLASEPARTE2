import {Console, error} from "console"; // Importar la librería de consola
import express from "express";
import fs from "fs"; // Importar la librería que me permite trabajar con archivos del sistema
import bodyParser from "body-parser"; // Importar la librería que me permite trabajar con el cuerpo de las peticiones
import {json} from "stream/consumers"; // Importar la librería que me permite trabajar con el cuerpo de las peticiones

// Levantar el servidor express
const app = express();
app.use(bodyParser.json()); // Middleware para parsear el cuerpo de las peticiones a JSON
// Leer la data del archivo
const readData = () => {
    try{
        const data = fs.readFileSync("./db.json"); // La función readFileSync ya es asíncrona, lee la data.
        return JSON.parse(data);
    } catch (error) {
        console.error("Error al leer el archivo:", error);
        return { books: [] }; // Retornar un objeto vacío en caso de error
    }
    
};

readData();

const writeData = (data) => {
    try{
        fs.writeFileSync("./db.json", JSON.stringify(data));
    }catch (error){
        console.log(error);
    }
}

app.get("/", (req, res) => {
    // Callback o función que recibe dos parámetros, petición y respuesta
    res.send("Bienvenido a mi primera API  Nodejs!"); // Objeto de la respuesta.
});

app.get("/books", (req, res) => {
    const data = readData();
    res.json(data.books);
});

app.get("/books/:id", (req, res) => {

    const data = readData();

    const id = parseInt(req.params.id); // Convertir el id a número entero

    const book = data.books.find((book) => book.id === id);

    res.json(book);

});

app.post("/books", (req, res) => {

    const data = readData();

    const body = req.body;

    const newbook = {
        id: data.books.length + 1,
        ...body,
    };

    data.books.push(newbook);

    writeData(data);

    res.json(newbook);

});

// Nuevo endpoint PUT para actualizar un libro por id
app.put("/books/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const bookIndex = data.books.findIndex((book) => book.id === id);

    if (bookIndex === -1) {
        return res.status(404).json({ error: "Libro no encontrado" });
    }

    // Actualiza solo los campos enviados en el body
    data.books[bookIndex] = { ...data.books[bookIndex], ...req.body };

    writeData(data);

    res.json(data.books[bookIndex]);
});

app.delete("/books/:id", (req, res) => {
    const data = readData();


    const id = parseInt(req.params.id);


    const bookIndex = data.books.findIndex((book) => book.id === id);


    data.books.splice(bookIndex, 1); // Eliminar el libro del array

    writeData(data);

    res.json({ message: "Libro eliminado correctamente" });
})
app.listen(3000, () => {
    // Función callback que imprime el mensaje
    console.log("El servidor está escuchando en el Puerto 3000 ");
});