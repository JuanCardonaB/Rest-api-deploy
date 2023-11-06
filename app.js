const express = require('express')
const moviesJSON = require('./movies.json')
const crypto = require('node:crypto')
const { validation, validationPartialMovie } = require('./schemmes/schemmaMovie')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:8080',
      'http://localhost:1234',
      'http://movies.com' // ejemplo de produccion
    ]

    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
}))

app.disable('x-powered-by')

const PORT = process.env.PORT ?? 1234

app.get('/movies', (req, res) => {
  const { genre } = req.query
  if (genre) {
    const filteredMovies = moviesJSON.filter(
      movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    )
    return res.json(filteredMovies)
  }

  res.json(moviesJSON)
})

app.get('/movies/:id', (req, res) => {
  const { id } = req.params

  const movie = moviesJSON.find(movie => movie.id === id)
  if (movie) {
    res.json(movie)
  } else {
    res.status(404).json({ error: 'Movie not found' })
  }
})

app.post('/movies', (req, res) => {
  // validacion zod
  const result = validation(req.body)

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const newMovie = {
    id: crypto.randomUUID(), // crea una id unica
    ...result.data
  }

  moviesJSON.push(newMovie)

  res.status(201).json(newMovie)
})

app.patch('/movies/:id', (req, res) => {
  const result = validationPartialMovie(req.body)

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  const movieIndex = moviesJSON.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: '404 not found' })
  }

  const updateMovie = {
    ...moviesJSON[movieIndex],
    ...result.data
  }

  moviesJSON[movieIndex] = updateMovie

  return res.json(updateMovie)
})

app.delete('/movies/:id', (req, res) => {
  const { id } = req.params
  const index = moviesJSON.findIndex(movie => movie.id === id)
  if (index !== -1) {
    moviesJSON.splice(index, 1)
    res.json({ success: true })
  } else {
    res.status(404).json({ error: 'Movie not found' })
  }
})

app.listen(PORT, () => {
  console.log(`server is listening on port http://localhost:${PORT} `)
})
