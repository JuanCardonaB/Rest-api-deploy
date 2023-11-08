import { randomUUID } from 'node:crypto'

import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const moviesJSON = require('../movies.json')

export class movieModel {
  static getAll = async ({ genre }) => {
    if (genre) {
      return moviesJSON.filter(
        movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
      )
    }
    return moviesJSON
  }

  static getId = async ({ id }) => {
    const movie = moviesJSON.find(movie => movie.id === id)
    if (movie) {
      return movie
    } else {
      return null // Agrega este retorno en caso de que la película no se encuentre
    }
  }

  static create = async ({ input }) => {
    const newMovie = {
      id: randomUUID(), // crea una id unica
      ...input
    }

    moviesJSON.push(newMovie)
    return newMovie
  }

  static delete = async ({ id }) => {
    const index = moviesJSON.findIndex(movie => movie.id === id)
    if (index !== -1) {
      moviesJSON.splice(index, 1)
      return true
    }
    return false
  }

  static update = async ({ id, input }) => {
    const movieIndex = moviesJSON.findIndex(movie => movie.id === id)
    if (movieIndex === -1) return false

    moviesJSON[movieIndex] = {
      ...moviesJSON[movieIndex],
      ...input
    }

    return moviesJSON[movieIndex]
  }
}
