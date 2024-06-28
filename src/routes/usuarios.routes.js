import { Router } from 'express'
import { getUsuarios, getUsuario, createUsuario, updateUsuario, deleteUsuario, patchUsuario } from '../controllers/usuarios.controller.js'

const router = Router()

router.get('/', getUsuarios)
router.get('/:id', getUsuario)
router.post('/', createUsuario)
router.patch('/:id', patchUsuario)
router.put('/:id', updateUsuario)
router.delete('/:id', deleteUsuario)

export default router
