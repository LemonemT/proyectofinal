import { Router } from 'express'
import { getComentarios, getComentario, createComentario, updateComentario, patchComentario, deleteComentario } from '../controllers/comentarios.controller.js'

const router = Router()

router.get('/', getComentarios)
router.get('/:id', getComentario)
router.post('/', createComentario)
router.put('/:id', updateComentario)
router.patch('/:id', patchComentario)
router.delete('/:id', deleteComentario)

export default router
