const { response } = require('express')
const Usuario = require('../models/Usuario')
const bcript = require('bcryptjs')
const { generarJWT } = require('../helpers/jwt')

 


const registrarUsuario = async (req, res = response) => {

    const {email, password} = req.body
    try {
        

        let usuario = await Usuario.findOne({email})
        
        if(usuario){
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un un usuario asociado a este correo'
            })
        }

        usuario = new Usuario(req.body)

        const salt = bcript.genSaltSync()
        const hash = bcript.hashSync(password, salt)
        usuario.password = hash

        await usuario.save()

        //Generar JWT
        const token = await generarJWT(usuario.id, usuario.name)

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
    } catch (error) {
        console.console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador' 
        })
    }

}

const loginUsuario = async (req, res = response) => {

    const { email, password } = req.body

    try {

        const usuario = await Usuario.findOne({email})
        if(!usuario){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            })
        }
        const passwordValidation = bcript.compareSync(password, usuario.password)
        if(!passwordValidation){
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            })
        }

        //Generar JWT
        const token = await generarJWT(usuario.id, usuario.name)

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador' 
        })
    }
}

const revalidarToken = async (req, res = response) => {
    const {uid, name} = req
    //Generar JWT
    const token = await generarJWT(uid, name)
    
    res.status(200).json({
        ok: true,
        msg: 'renew',
        token
    })
}

module.exports = {
    registrarUsuario,
    loginUsuario,
    revalidarToken
}