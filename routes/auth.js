// Rutas para autenticas usuarios
const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const { check } = require('express-validator')
const auth = require('../middleware/auth')

// api/auth
// Autentica un usuario(Iniciar sesion)
router.post('/',
    // [
    //     check('email', 'Agrega un email valido').isEmail(),
    //     check('password', 'el password debe ser minimo de 6 caracteres').isLength({min:6})

    // ],
    authController.autenticarUsuario
)

// Obtiene el usuario autenticado
router.get('/',
    auth,
    authController.usuarioAutenticado
)
module.exports = router