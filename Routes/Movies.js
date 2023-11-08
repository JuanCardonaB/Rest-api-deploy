import { Router } from 'express'

import { MovieController } from '../controllers/moviesControllers.js'

export const MoviesRouter = Router()

MoviesRouter.get('/', MovieController.getAll)

MoviesRouter.get('/:id', MovieController.getId)

MoviesRouter.post('/', MovieController.create)

MoviesRouter.delete('/:id', MovieController.delete)

MoviesRouter.patch('/:id', MovieController.update)
