import express, { Request, Response } from 'express'
import userService from '../services/userService'

const router = express.Router()

router.get('/:id', (req: Request, res: Response) => {
  const userId = Number.parseInt(req.params.id, 10)
  const user = userService.getUserById(userId)
  if (user) {
    res.send(user)
  } else {
    res.status(404).send('User not found')
  }
})

export default router
