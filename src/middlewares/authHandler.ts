/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import passport from 'passport'
import '../authentication/passportHandler'
import Kupac from '../entities/Kupac'
import Role from '../models/enums/Role'

export default class AuthMiddleware {
  public static authenticateJWT(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    passport.authenticate('jwt', function (err: any, user: Kupac) {
      if (err) {
        console.log(err)
        return res.status(401).json({ status: 'error', code: 'unauthorized' })
      }
      if (!user) {
        return res.status(401).json({ status: 'error', code: 'unauthorized' })
      }
      req.user = user
      return next()
    })(req, res, next)
  }

  public static authorizeRoles(allowedRoles: Role[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user)
        return res.status(401).json({ status: 'error', code: 'unauthorized' })

      if (!allowedRoles.includes((req.user as Kupac).role))
        return res.status(401).json({ status: 'error', code: 'unauthorized' })

      return next()
    }
  }
}
