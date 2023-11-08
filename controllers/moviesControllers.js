import { movieModel } from '../models/movieModels.js'
import { validation, validationPartialMovie } from '../schemmes/schemmaMovie.js'

export class MovieController {
  static getAll = async (req, res) => {
    const { genre } = req.query
    const movies = await movieModel.getAll({ genre }) // aqui esta haciendo la logica
    res.json(movies)
  }

  static getId = async (req, res) => {
    const { id } = req.params
    const movieById = await movieModel.getId({ id })
    if (movieById) return res.json(movieById)
    res.status(404).json({ message: '404 not found' })
  }

  static create = async (req, res) => {
    // validacion zod
    const result = validation(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const newMovie = await movieModel.create({ input: result.data })

    res.status(201).json(newMovie)
  }

  static delete = async (req, res) => {
    const { id } = req.params

    const result = await movieModel.delete({ id })

    if (result === false) {
      res.status(404).json({ error: 'Movie not found' })
    }

    return res.json({ message: 'Movie deleted' })
  }

  static update = async (req, res) => {
    const result = validationPartialMovie(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params
    const updatedMovie = await movieModel.update({ id, input: result.data })

    return res.json(updatedMovie)
  }
}
