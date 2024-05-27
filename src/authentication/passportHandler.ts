import passport from 'passport'
import passportJwt, { VerifiedCallback } from 'passport-jwt'
import Kupac from '../entities/Kupac'

const JwtStrategy = passportJwt.Strategy
const { ExtractJwt } = passportJwt

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.TOKEN_SECRET,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (jwtToken: any, done: VerifiedCallback) => {
      Kupac.findOne({ where: { kupacId: jwtToken.sub } }).then((user) => {
        if (user) {
          return done(undefined, user, jwtToken)
        }
        return done(undefined, false)
      })
    },
  ),
)
