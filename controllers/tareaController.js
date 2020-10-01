const Tarea = require('../models/Tarea')
const Proyecto = require('../models/Proyecto')
const { validationResult } = require('express-validator')

exports.crearTarea = async (req, res)=>{
    // Revisar si hay errores
    const errores = validationResult(req)

    if (!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()})
    }

    try {
        // Extraer el Proyecto y comprobar si existe
        const {proyecto} = req.body

        const existeProyecto = await Proyecto.findById(proyecto)
        
        if (!existeProyecto) {
            return res.status(404).json({mgs: 'Proyecto no encontrado'})
        } 

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({mgs: 'No Autorizado'})
        }

        // Creamos la Tarea
        const tarea = new Tarea(req.body)
        await tarea.save()
        res.json({tarea})

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un Error en el Servidor')
    }
}


// Obtiene las tareas por Proyect
exports.obtenerTareas = async (req, res)=>{
    
    try {
        // Extraer el Proyecto y comprobar si existe
        //const {proyecto} = req.body
        const {proyecto} = req.query

        console.log("Valor de proyecto en obtenerTarea",proyecto)

        const existeProyecto = await Proyecto.findById(proyecto)
        
        if (!existeProyecto) {
            return res.status(404).json({mgs: 'Proyecto no encontrado'})
        } 

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({mgs: 'No Autorizado'})
        }

        // Listamos las Tareas por Proyecto
        const tareas = await Tarea.find({proyecto:proyecto}).sort({creado: -1})
        res.json({tareas})

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un Error en el Servidor')
    }
}

// Actualizar una Tarea
exports.actualizarTarea = async (req, res)=>{
    
    try {
        // Extraer el Proyecto y comprobar si existe
        const { proyecto, nombre, estado } = req.body

        // Si la Tarea existe o no
        let tarea = await Tarea.findById(req.params.id)
        
        if (!tarea) {
            return res.status(404).json({mgs: 'No existe esa Tarea'})
        } 

        // Extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto)

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({mgs: 'No Autorizado'})
        }

        // Crear un objeto con la nueva informacion
        const nuevaTarea = {}
        nuevaTarea.nombre = nombre
        nuevaTarea.estado = estado

        //Guardar la Tarea
        tarea = await Tarea.findOneAndUpdate({_id: req.params.id}, nuevaTarea, {new: true})
        res.json({tarea})

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un Error en el Servidor')
    }
}

// Elimina una Tarea
exports.eliminarTarea = async (req, res)=>{
    
    try {
        // Extraer el Id del Proyecto y comprobar si existe
        const { proyecto } = req.query

        // Si la Tarea existe o no
        let tarea = await Tarea.findById(req.params.id)
        
        if (!tarea) {
            return res.status(404).json({mgs: 'No existe esa Tarea'})
        } 

        // Extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto)

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({mgs: 'No Autorizado'})
        }

        // Eliminar
        await Tarea.findOneAndRemove({_id: req.params.id})
        res.json({msg: 'Tarea Eliminada'})
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un Error en el Servidor')
    }
}