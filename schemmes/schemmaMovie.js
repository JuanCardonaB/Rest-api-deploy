const z = require('zod')

const shemaMovie = z.object({
  title: z.string({
    invalid_type_error: 'Movie title must be a string',
    required_error: 'Movie title is required'
  }),
  year: z.number().int().positive().min(1900).max(2024),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).default(0),
  poster: z.string().url({
    message: 'Movie poster must be a valid URL'
  }),
  genre: z.array(
    z.enum(['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi', 'Crime'])
  )
})

const validation = (object) => {
  return shemaMovie.safeParse(object)
}

const validationPartialMovie = (object) => {
  return shemaMovie.partial().safeParse(object) // partial() hace que todas las propiedades sean opcionales
}

module.exports = {
  validation,
  validationPartialMovie
}
