const express = require('express')
const Evento = require('../models/Evento')


const obtenerEventos = async (req, res) => {

    const eventos = await Evento.find().populate('user', 'name')

    return res.status(200).json({
        ok: true,
        eventos
    })
}

const crearEvento = async (req, res) => {
 
    const evento = new Evento(req.body)

    try {
        
        evento.user = req.uid
        const eventoGuardado = await evento.save()
        return res.status(200).json({
            ok: true,
            evento: eventoGuardado
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}


const editarEvento = async (req, res) => {

    const eventoId = req.params.id
    try {

        const evento = await Evento.findById(eventoId)
        if(!evento){

            return res.status(404).json({
                ok: false,
                msg: 'No hay ningun evento con ese Id'
            })
        }

        if(evento.user.toString() !== req.uid){
            return res.status(401).json({
                ok: false,
                msg: 'No tienes permisos para modificar este evento'
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: req.uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, {new: true})

        return res.status(200).json({
            ok: true,
            evento: eventoActualizado
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}


const eliminarEvento = async (req, res) => {

    const eventoId = req.params.id
    try {
        const evento = await Evento.findById(eventoId)
        if(!evento){
            return res.status(404).json({
                ok: false,
                msg: 'No hay ningun evento con ese Id'
            })
        }

        if(evento.user.toString() !== req.uid){
            return res.status(401).json({
                ok: false,
                msg: 'No tienes permisos para eliminar este evento' 
            })
        }

        await Evento.findByIdAndDelete(eventoId)

        return res.status(200).json({
            ok: true,
            msg: 'Evento eliminado'
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
    
}

module.exports = {
    obtenerEventos,
    crearEvento,
    editarEvento,
    eliminarEvento
}