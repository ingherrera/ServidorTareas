const express = require('express')
const router = express.Router()
const proyectoController = require('../controllers/proyectoController')
const auth = require('../middleware/auth')
const { check }= require('express-validator')



// api/proyectos
// Crea un Proyecto
router.post('/',
    auth,
    [
        check('nombre', 'El nombre del Proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.crearProyecto
)

// Obtener todos los proyectos
router.get('/',
    auth,
    proyectoController.obtenerProyectos
)

// Actualizar Proyecto via ID
router.put('/:id',
    auth,
    [
        check('nombre', 'El nombre del Proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.actualizarProyecto
)


// Eliminar un Proyecto
router.delete('/:id',
    auth,
    proyectoController.eliminarProyecto
)

module.exports = router