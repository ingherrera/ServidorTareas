// const express = require('express')
const jwt = require('jsonwebtoken')

module.exports = function( req, res, next){
    // Leer el token del header
    const token = req.header('x-auth-token')

    console.log(token);

    // Revisar si no hay Token
    if(!token){
        return res.status(401).json({msg:'No hay Token, permiso no válido'})
    }

    // Validar el Token
    try {
        const cifrado = jwt.verify(token, process.env.SECRETA)
        console.log("valor de cifrado", cifrado);
        req.usuario = cifrado.usuario
        console.log("valor de req.usuario",req.usuario);
        next()
    } catch (error) {
        res.status(401).json({msg: 'Token no válido'})
    }
}