import Role from '../models/enums/Role'

/* eslint-disable class-methods-use-this */
export default class IntegerToRoleTransformer {
  to(data: Role): number {
    return data as number
  }

  from(data: number): Role {
    return data as Role
  }
}
