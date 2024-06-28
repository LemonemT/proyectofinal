import { pool } from '../config/db.js'

export const getRoles = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM Roles')
  res.json(rows)
}

export const getRole = async (req, res) => {
  const { id } = req.params
  const [rows] = await pool.query('SELECT * FROM Roles WHERE id = ?', [id])
  res.json(rows[0])
}

export const createRole = async (req, res) => {
  const { nombre } = req.body
  const [result] = await pool.query('INSERT INTO Roles(nombre) VALUES (?)', [nombre])
  res.json({ id: result.insertId, nombre })
}

export const updateRole = async (req, res) => {
  const { id } = req.params
  const { nombre } = req.body
  await pool.query('UPDATE Roles SET nombre = ? WHERE id = ?', [nombre, id])
  res.sendStatus(204)
}

export const deleteRole = async (req, res) => {
  const { id } = req.params
  await pool.query('DELETE FROM Roles WHERE id = ?', [id])
  res.sendStatus(204)
}
