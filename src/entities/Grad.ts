/* eslint-disable import/no-cycle */
import {
  BaseEntity,
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import Adresa from './Adresa'
import AddressInformation from '../models/addressInformation'

@Index('Grad_pkey', ['gradId'], { unique: true })
@Entity('Grad', { schema: 'public' })
export default class Grad extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'grad_id' })
  gradId!: number

  @Column('character varying', {
    name: 'postanski_broj',
    nullable: true,
    length: 128,
  })
  postanskiBroj!: string | null

  @Column('character varying', { name: 'grad', nullable: true, length: 255 })
  grad!: string | null

  @Column('character varying', { name: 'drzava', nullable: true, length: 255 })
  drzava!: string | null

  @OneToMany(() => Adresa, (adresa: Adresa) => adresa.grad)
  adresas!: Adresa[]

  public static async GetExistingGradFromAddressInformation(
    address: AddressInformation,
  ): Promise<Grad | null> {
    return Grad.findOne({
      where: {
        drzava: address.drzava,
        grad: address.grad,
        postanskiBroj: address.postanskiBroj,
      },
    })
  }

  public static GradFromAddressInformation(address: AddressInformation): Grad {
    const grad = new Grad()
    grad.drzava = address.drzava
    grad.grad = address.grad
    grad.postanskiBroj = address.postanskiBroj
    return grad
  }
}
