import { Router } from 'express'
import { getPublicaciones, getPublicacion, createPublicacion, updatePublicacion, patchPublicacion, deletePublicacion } from '../controllers/publicaciones.controller.js'

const router = Router()

router.get('/', getPublicaciones)
router.get('/:id', getPublicacion)
router.post('/', createPublicacion)
router.put('/:id', updatePublicacion)
router.patch('/:id', patchPublicacion)
router.delete('/:id', deletePublicacion)

export default router
