import express, { json } from 'express'
import cors from 'cors'
import { MoviesRouter } from './Routes/movies.js'

// forma de importar json en ecma script modules
// import fs from 'node:fs'
// const moviesJSON = JSON.parse(fs.readFileSync('./movies.json', 'utf-8'))

// FORMA CORRECTA PARA IMPORTAR JSON EN ESCmodules

const app = express()

app.use(json())
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

app.use('/movies', MoviesRouter)

app.listen(PORT, () => {
  console.log(`server is listening on port http://localhost:${PORT} `)
})
