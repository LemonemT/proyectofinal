import { pool } from '../config/db.js'

export const getUsuarios = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM usuarios')
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

export const getUsuario = async (req, res) => {
  try {
    const { id } = req.params
    const [rows] = await pool.execute('SELECT * FROM usuarios WHERE id = ?', [id])

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    res.json(rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

export const createUsuario = async (req, res) => {
  try {
    const { nombre, email, password, roleId } = req.body

    if (!nombre || !email || !password || !roleId) {
      return res.status(400).json({ message: 'Faltan datos en el formulario' })
    }

    if (![1, 2].includes(parseInt(roleId, 10))) {
      return res.status(400).json({ message: 'El roleId debe ser 1 (usuario) o 2 (supervisor)' })
    }

    const [resultado] = await pool.execute(
      'INSERT INTO usuarios (nombre, email, password, roleId) VALUES (?, ?, ?, ?)',
      [nombre, email, password, roleId]
    )

    if (resultado.affectedRows !== 1) {
      return res.status(500).json({ message: 'Hubo un error al crear el usuario' })
    }

    res.status(201).json({ message: 'Usuario guardado' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error interno', details: error.message })
  }
}

export const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, email, password, roleId } = req.body

    if (!nombre || !email || !password || !roleId) {
      return res.status(400).json({ message: 'Faltan datos en el formulario' })
    }

    if (![1, 2].includes(parseInt(roleId, 10))) {
      return res.status(400).json({ message: 'El roleId debe ser 1 (usuario) o 2 (supervisor)' })
    }

    const [resultado] = await pool.execute(
      'UPDATE usuarios SET nombre = ?, email = ?, password = ?, roleId = ? WHERE id = ?',
      [nombre, email, password, roleId, id]
    )

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    res.json({ message: 'Usuario actualizado' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error interno', details: error.message })
  }
}

export const patchUsuario = async (req, res) => {
  try {
    const { id } = req.params
    const fields = req.body
    const setClause = Object.keys(fields).map(key => `${key} = ?`).join(', ')
    const values = [...Object.values(fields), id]

    if (!setClause) {
      return res.status(400).json({ message: 'No se proporcionaron datos para actualizar' })
    }

    if (fields.roleId && ![1, 2].includes(parseInt(fields.roleId, 10))) {
      return res.status(400).json({ message: 'El roleId debe ser 1 (usuario) o 2 (supervisor)' })
    }

    const [resultado] = await pool.execute(
      `UPDATE usuarios SET ${setClause} WHERE id = ?`,
      values
    )

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    res.json({ message: 'Usuario actualizado parcialmente' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error interno', details: error.message })
  }
}

export const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params

    const [resultado] = await pool.execute('DELETE FROM usuarios WHERE id = ?', [id])

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    res.json({ message: 'Usuario eliminado' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error interno', details: error.message })
  }
}
