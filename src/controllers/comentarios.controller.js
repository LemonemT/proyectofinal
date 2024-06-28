import { pool } from '../config/db.js'

export const getComentarios = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM comentarios')
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

export const getComentario = async (req, res) => {
  try {
    const { id } = req.params
    const [rows] = await pool.execute('SELECT * FROM comentarios WHERE id = ?', [id])

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Comentario no encontrado' })
    }

    res.json(rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

export const createComentario = async (req, res) => {
  try {
    const { contenido, usuarioId, publicacionId } = req.body

    if (!contenido || !usuarioId || !publicacionId) {
      return res.status(400).json({ message: 'Faltan datos en el formulario' })
    }

    const [resultado] = await pool.execute(
      'INSERT INTO comentarios (contenido, usuarioId, publicacionId) VALUES (?, ?, ?)',
      [contenido, usuarioId, publicacionId]
    )

    if (resultado.affectedRows !== 1) {
      return res.status(500).json({ message: 'Hubo un error al crear el comentario' })
    }

    res.status(201).json({ message: 'Comentario guardado' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error interno', details: error.message })
  }
}

export const updateComentario = async (req, res) => {
  try {
    const { id } = req.params
    const { contenido, usuarioId, publicacionId } = req.body

    if (!contenido || !usuarioId || !publicacionId) {
      return res.status(400).json({ message: 'Faltan datos en el formulario' })
    }

    const [resultado] = await pool.execute(
      'UPDATE comentarios SET contenido = ?, usuarioId = ?, publicacionId = ? WHERE id = ?',
      [contenido, usuarioId, publicacionId, id]
    )

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ message: 'Comentario no encontrado' })
    }

    res.json({ message: 'Comentario actualizado' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error interno', details: error.message })
  }
}

export const patchComentario = async (req, res) => {
  try {
    const { id } = req.params
    const fields = req.body
    const setClause = Object.keys(fields).map(key => `${key} = ?`).join(', ')
    const values = [...Object.values(fields), id]

    if (!setClause) {
      return res.status(400).json({ message: 'No se proporcionaron datos para actualizar' })
    }

    const [resultado] = await pool.execute(
      `UPDATE comentarios SET ${setClause} WHERE id = ?`,
      values
    )

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ message: 'Comentario no encontrado' })
    }

    res.json({ message: 'Comentario actualizado parcialmente' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error interno', details: error.message })
  }
}

export const deleteComentario = async (req, res) => {
  try {
    const { id } = req.params

    const [resultado] = await pool.execute('DELETE FROM comentarios WHERE id = ?', [id])

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ message: 'Comentario no encontrado' })
    }

    res.json({ message: 'Comentario eliminado' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error interno', details: error.message })
  }
}
