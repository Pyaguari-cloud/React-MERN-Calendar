/* 

    Ruta: /api/auth
    localhost:4000/api/auth

*/

const { Router } = require('express');
const { registrarUsuario, loginUsuario, revalidarToken} = require('../controllers/auth')
const { fieldsValidations} = require('../middlewares/fieldsValidations')
const { check } = require('express-validator')
const { validarJWT } = require('../middlewares/validar-token')



const router = Router();
router.post(
    '/new', 
    [
        check('name', 'El nombre es obligatorio').notEmpty(),
        check('email', 'El correo es obligatorio').isEmail(),
        check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({min: 6}),
        fieldsValidations
    ],
    registrarUsuario)

router.post(
    '/',
    [
        check('email', 'El correo es obligatorio').isEmail(),
        check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({min: 6}),
        fieldsValidations
    ],
    loginUsuario)

router.get('/renew', validarJWT, revalidarToken)


module.exports = router;