import { Router } from 'express'
import { randomUUID } from 'node:crypto'
import { validation, validationPartialMovie } from '../schemmes/schemmaMovie.js'

import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const moviesJSON = require('../movies.json')

export const MoviesRouter = Router()

MoviesRouter.get('/', (req, res) => {
  const { genre } = req.query
  if (genre) {
    const filteredMovies = moviesJSON.filter(
      movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    )
    return res.json(filteredMovies)
  }

  res.json(moviesJSON)
})

MoviesRouter.get('/:id', (req, res) => {
  const { id } = req.params

  const movie = moviesJSON.find(movie => movie.id === id)
  if (movie) {
    res.json(movie)
  } else {
    res.status(404).json({ error: 'Movie not found' })
  }
})

MoviesRouter.post('/', (req, res) => {
  // validacion zod
  const result = validation(req.body)

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const newMovie = {
    id: randomUUID(), // crea una id unica
    ...result.data
  }

  moviesJSON.push(newMovie)

  res.status(201).json(newMovie)
})

MoviesRouter.delete('/:id', (req, res) => {
  const { id } = req.params
  const index = moviesJSON.findIndex(movie => movie.id === id)
  if (index !== -1) {
    moviesJSON.splice(index, 1)
    res.json({ success: true })
  } else {
    res.status(404).json({ error: 'Movie not found' })
  }
})

MoviesRouter.patch('/:id', (req, res) => {
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
