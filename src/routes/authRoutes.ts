import express, { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import Kupac from '../entities/Kupac'

const router = express.Router()

router.post('/login', async (req: Request, res: Response) => {
  const userRequest = req.body as { email: string }
  const user = await Kupac.findOne({ where: { email: userRequest.email } })
  if (user) {
    const token = jwt.sign(
      { sub: user.kupacId },
      process.env.TOKEN_SECRET as string,
    )
    return res.status(200).send({ token })
  }
  return res.status(401).json({ status: 'error', code: 'user not found' })
})

export default router
