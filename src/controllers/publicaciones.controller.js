import { pool } from '../config/db.js'

export const getPublicaciones = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM publicaciones')
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

export const getPublicacion = async (req, res) => {
  try {
    const { id } = req.params
    const [rows] = await pool.execute('SELECT * FROM publicaciones WHERE id = ?', [id])

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Publicación no encontrada' })
    }

    const [categorias] = await pool.execute(
      'SELECT c.* FROM categorias c INNER JOIN publicacion_categoria pc ON c.id = pc.categoriaId WHERE pc.publicacionId = ?',
      [id]
    )

    res.json({ ...rows[0], categorias })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

export const createPublicacion = async (req, res) => {
  try {
    const { titulo, contenido, usuarioId, categorias } = req.body

    if (!titulo || !contenido || !usuarioId) {
      return res.status(400).json({ message: 'Faltan datos en el formulario' })
    }

    const [resultado] = await pool.execute(
      'INSERT INTO publicaciones (titulo, contenido, usuarioId) VALUES (?, ?, ?)',
      [titulo, contenido, usuarioId]
    )

    const publicacionId = resultado.insertId

    if (categorias && categorias.length > 0) {
      const categoriaValues = categorias.map(categoriaId => [publicacionId, categoriaId])
      await pool.query(
        'INSERT INTO publicacion_categoria (publicacionId, categoriaId) VALUES ?',
        [categoriaValues]
      )
    }

    res.status(201).json({ message: 'Publicación guardada', id: publicacionId })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error interno', details: error.message })
  }
}

export const updatePublicacion = async (req, res) => {
  try {
    const { id } = req.params
    const { titulo, contenido, usuarioId, categorias } = req.body

    if (!titulo || !contenido || !usuarioId) {
      return res.status(400).json({ message: 'Faltan datos en el formulario' })
    }

    const [resultado] = await pool.execute(
      'UPDATE publicaciones SET titulo = ?, contenido = ?, usuarioId = ? WHERE id = ?',
      [titulo, contenido, usuarioId, id]
    )

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ message: 'Publicación no encontrada' })
    }

    if (categorias && categorias.length > 0) {
      await pool.execute('DELETE FROM publicacion_categoria WHERE publicacionId = ?', [id])

      const categoriaValues = categorias.map(categoriaId => [id, categoriaId])
      await pool.query(
        'INSERT INTO publicacion_categoria (publicacionId, categoriaId) VALUES ?',
        [categoriaValues]
      )
    }

    res.json({ message: 'Publicación actualizada' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error interno', details: error.message })
  }
}

export const patchPublicacion = async (req, res) => {
  try {
    const { id } = req.params
    const { categorias, ...fields } = req.body

    if (Object.keys(fields).length === 0 && !categorias) {
      return res.status(400).json({ message: 'No se proporcionaron datos para actualizar' })
    }

    // Actualizar campos de la publicación
    if (Object.keys(fields).length > 0) {
      const setClause = Object.keys(fields).map(key => `${key} = ?`).join(', ')
      const values = [...Object.values(fields), id]

      const [updateResult] = await pool.execute(
        `UPDATE publicaciones SET ${setClause} WHERE id = ?`,
        values
      )

      if (updateResult.affectedRows === 0) {
        return res.status(404).json({ message: 'Publicación no encontrada' })
      }
    }

    // Asignar categorías a la publicación
    if (categorias && Array.isArray(categorias)) {
      // Primero, eliminar las categorías actuales
      await pool.execute('DELETE FROM publicacion_categoria WHERE publicacion_id = ?', [id])

      // Luego, insertar las nuevas categorías
      for (const categoriaId of categorias) {
        await pool.execute('INSERT INTO publicacion_categoria (publicacion_id, categoria_id) VALUES (?, ?)', [id, categoriaId])
      }
    }

    res.json({ message: 'Publicación actualizada parcialmente' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error interno', details: error.message })
  }
}

export const deletePublicacion = async (req, res) => {
  try {
    const { id } = req.params

    await pool.execute('DELETE FROM publicacion_categoria WHERE publicacionId = ?', [id])
    const [resultado] = await pool.execute('DELETE FROM publicaciones WHERE id = ?', [id])

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ message: 'Publicación no encontrada' })
    }

    res.json({ message: 'Publicación eliminada' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error interno', details: error.message })
  }
}
