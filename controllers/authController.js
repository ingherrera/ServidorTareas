const Usuario = require('../models/Usuario')
const bcryptjs = require('bcryptjs')
const { validationResult }=require('express-validator')
const jwt = require('jsonwebtoken')


// request= req = lo que el usuario envia
// response = res = lo que el servidor responde
exports.autenticarUsuario = async (req, res) => {

    // Revisar si hay errores
    const errores = validationResult(req)
    if (!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()})
    }

    // Extraer email y password
    const { email, password } = req.body
    
    try {
        // Revisar que sea un  usuario registrado
        let usuario = await Usuario.findOne({ email})

        if (!usuario) {
            return res.status(400).json({msg: 'El usuario no existe'})
        }
        // Revisar el password
        // 1) password=viene del req.body(es decir del usuario)
        // 2) usuario.password= se obtuvo del servidor
        const passCorrecto = await bcryptjs.compare(password,usuario.password)
        if (!passCorrecto) {
            return res.status(400).json({msg: 'Password Incorrecto'})
        }

        // Si todo es correcto Crear el JWT
        const payload = {
            usuario:{
                id: usuario.id
            }
        }
        
        // Firmar el JWT
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600*5
        }, (error, token) => {
            if (error) throw error
        
            // Mensaje de confirmacion
            res.json({token})
            // res.json({mensaje: "deberia enviar el token"})
        })

    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error')
    }
}

// Obtiene que usuario esta autenticado
exports.usuarioAutenticado  = async(req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password')
        res.json({usuario})
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'})
    }
}
