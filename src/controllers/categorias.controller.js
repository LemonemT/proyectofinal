import { pool } from '../config/db.js'

export const getCategorias = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM Categorias')
  res.json(rows)
}

export const getCategoria = async (req, res) => {
  const { id } = req.params
  const [rows] = await pool.query('SELECT * FROM Categorias WHERE id = ?', [id])
  res.json(rows[0])
}

export const createCategoria = async (req, res) => {
  const { nombre } = req.body
  const [result] = await pool.query('INSERT INTO Categorias(nombre) VALUES (?)', [nombre])
  res.json({ id: result.insertId, nombre })
}

export const updateCategoria = async (req, res) => {
  const { id } = req.params
  const { nombre } = req.body
  await pool.query('UPDATE Categorias SET nombre = ? WHERE id = ?', [nombre, id])
  res.sendStatus(204)
}

export const deleteCategoria = async (req, res) => {
  const { id } = req.params
  await pool.query('DELETE FROM Categorias WHERE id = ?', [id])
  res.sendStatus(204)
}
