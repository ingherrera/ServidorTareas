const express = require('express')
const conectarDB = require('./config/db')
const cors = require('cors')


// Crear el servidor
const app  = express()

// Conectar a la base de Datos
conectarDB()

/* Habilitar cors
-----------------
(Para evitar msg de error, debido a que el servidor
esta en localhost:4000 y el cliente en localhost:3000) */
app.use(cors())

// Habilitar express.json
app.use( express.json({ extended: true}) )

// Puerto de la APP
const port = process.env.port || 4000

//Definir la pagina principal
//app.get('/', (req, res) => {
//	res.send('Servidor Funcionando, todo ok!!')
//})

// Importar rutas
app.use('/api/usuarios', require('./routes/usuarios'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/proyectos', require('./routes/proyectos'))
app.use('/api/tareas', require('./routes/tareas'))

// Arrancar la app
app.listen(port, '0.0.0.0', ()=>{
    console.log(`El servidor esta funcionando en el puerto ${port}`);
})