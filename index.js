//! Importar express
const express = require('express');
const cors = require('cors')
//! se importa el dotenv para poder usar las variables de entorno dentro del archivo o si no se puede usar process.env.PORT que es de donde se obtiene el puerto
//* se debe de instalar dotenv con npm install dotenv
require('dotenv').config()
//! Importar la base de datos
const { dbConnection } = require('./database/config')


//! crear una instacia de express o crear un servidor
const app = express()

//! Base de datos
dbConnection()

app.use(cors())

//! Directorio publico
app.use(express.static('public'))

//! Lectura y parseo del body
app.use(express.json())

//! Crear rutas
//Todo: rutas para auth
app.use('/api/auth', require('./routes/auth'))
app.use('/api/events', require('./routes/events'))
//Todo: rutas para crud de eventos




//! escuchar peticiones
app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`)
}) 