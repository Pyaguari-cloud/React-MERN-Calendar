const {Router} = require('express')
const { check } = require('express-validator')

const { obtenerEventos, crearEvento, editarEvento, eliminarEvento} = require('../controllers/events')
const { validarJWT} = require('../middlewares/validar-token')
const { fieldsValidations } = require('../middlewares/fieldsValidations')
const { isDate } = require('../helpers/isDate')

const router = Router()

router.use(validarJWT)

router.get('/', obtenerEventos)

router.post(
    '/', 
    [
        check('title', 'El titulo es obligatorio').notEmpty(),
        check('start', 'La fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'La fecha de finalización es obligatoria').custom( isDate ),
        fieldsValidations
    ], 
    crearEvento)

router.put(
    '/:id',
    [
        check('title', 'El titulo es obligatorio').notEmpty(),
        check('start', 'La fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'La fecha de finalizacion es obligatorio').custom( isDate),
        fieldsValidations   
    ],
    editarEvento)

router.delete('/:id', eliminarEvento)

module.exports = router