const Proyecto = require('../models/Proyecto')
const { validationResult } = require('express-validator')

exports.crearProyecto = async (req, res) => {

    // Revisar si hay errores
    const errores = validationResult(req)
    if (!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()})
    }

    try {
        // Crear un nuevo Proyecto
        const proyecto = new Proyecto(req.body)
        console.log("Desde Crear Proyecto, proyecto=", proyecto);
        
        // Guardar el creador via JWT
        proyecto.creador = req.usuario.id
        
        // Guardamos el proyecto
        proyecto.save()
        res.json(proyecto)
        
    } catch (error) {
        console.log('error');
        res.status(500).send('Hubo un error')
    }
} 

// Obtiene todos los proyectos del Usuario Actual
exports.obtenerProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.find({creador: req.usuario.id}).sort({creado: -1})
        res.json({proyectos})
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error')
    }
}

// Actualiza un Proyecto
exports.actualizarProyecto = async (req, res) => {

    // Revisar si hay errores
    const errores = validationResult(req)
    if (!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()})
    }

    // Extraer la informacion del Proyecto
    const { nombre } = req.body
    const nuevoProyecto = {}

    // Por cada campo se requiere un if
    if (nombre) {
        nuevoProyecto.nombre = nombre
    }

    try {

        // Revisar el ID
        /* SOLUCION DE UN ALUMNO: FUNCIONA OK
        await Proyecto.findById(req.params.id, (err, proyecto) => {

            //Si el proyecto existe o no
            if (err || !proyecto) {
                return res.status(404).json({
                    msg: 'Proyecto no encontrado'
                });
            }

            //Verificar el creador del proyecto
            if (proyecto.creador.toString() !== req.usuario.id) {
                return res.status(401).json({
                    msg: 'No Autorizado'
                });
            }
        }); */

        let proyecto = await Proyecto.findById(req.params.id)
        // console.log("Proyecto a editar", proyecto);

        // Si el Proyecto existe o no
        if (!proyecto) {
            return res.status(404).json({mgs: 'Proyecto no encontrado'})
        } 

        // Verificar el creador del proyecto
        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({mgs: 'No Autorizado'})
        }

        // Actualizar
        proyecto = await Proyecto.findByIdAndUpdate({_id: req.params.id }, {$set: nuevoProyecto},{new: true} )
        res.json({proyecto})
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el Servidor')
    }
}


// Elimina un Proyecto por su id
exports.eliminarProyecto = async (req, res) => {
 
    try {

        // Revisar el ID
        let proyecto = await Proyecto.findById(req.params.id)
        

        // Si el Proyecto existe o no
        if (!proyecto) {
            return res.status(404).json({mgs: 'Proyecto no encontrado'})
        } 

        // Verificar el creador del proyecto
        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({mgs: 'No Autorizado'})
        }

        // Eliminar el Proyecto
        await Proyecto.findOneAndRemove({_id: req.params.id } )
        res.json({msg: 'Proyecto Eliminado'})
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el Servidor')
    }
}