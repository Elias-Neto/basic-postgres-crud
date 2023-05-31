require('dotenv').config()
const express = require('express')

const app = express()
app.use(express.json())

const { pool, initDatabase } = require('./db')

// Create a new book
app.post('/books', async (req, res) => {
  const { title } = req.body
  const { rows } = await pool.query(`INSERT INTO books (title) VALUES ($1) RETURNING *`, [title])
  res.status(201).json(rows[0])
})

// Get all books
app.get('/books', async (req, res) => {
  const { rows } = await pool.query(`SELECT * FROM books`)
  rows.length > 0 ? res.json(rows) : res.status(404).json({ message: 'No books found' })
})

// Get a book by id
app.get('/books/:id', async (req, res) => {
  const { id } = req.params
  const { rows } = await pool.query(`SELECT * FROM books WHERE id = $1`, [id])
  rows.length > 0 ? res.json(rows[0]) : res.status(404).json({ message: 'Book not found' })
})

// Update a book
app.put('/books/:id', async (req, res) => {
  const { id } = req.params
  const { title } = req.body
  const { rows } = await pool.query(`UPDATE books SET title = $1 WHERE id = $2 RETURNING *`, [title, id])
  rows.length > 0 ? res.json(rows[0]) : res.status(404).json({ message: 'Book not found' })
})

// Delete a book
app.delete('/books/:id', async (req, res) => {
  const { id } = req.params
  const { rows } = await pool.query(`DELETE FROM books WHERE id = $1 RETURNING *`, [id])
  rows.length > 0 ? res.json(rows[0]) : res.status(404).json({ message: 'Book not found' })
})

initDatabase()

const port = process.env.APP_PORT || 3000

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})