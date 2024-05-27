/* eslint-disable import/no-cycle */
import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import Grad from './Grad'
import Kupac from './Kupac'
import AddressInformation from '../models/addressInformation'

@Index('Adresa_pkey', ['adresaId'], { unique: true })
@Entity('Adresa', { schema: 'public' })
export default class Adresa extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'adresa_id' })
  adresaId!: number

  @Column('character varying', { name: 'ulica', nullable: true, length: 255 })
  ulica!: string | null

  @Column('character varying', { name: 'broj', nullable: true, length: 32 })
  broj!: string | null

  @Column('character varying', {
    name: 'napomena_dostavljacu',
    nullable: true,
    length: 255,
  })
  napomenaDostavljacu!: string | null

  @ManyToOne(() => Grad, (grad: Grad) => grad.adresas)
  @JoinColumn([{ name: 'grad_id', referencedColumnName: 'gradId' }])
  grad!: Grad

  @OneToMany(() => Kupac, (kupac: Kupac) => kupac.adresa)
  kupacs!: Kupac[]

  public static async GetExistingAddressFromAddressInformation(
    address: AddressInformation,
  ): Promise<Adresa | null> {
    const grad = await Grad.GetExistingGradFromAddressInformation(address)
    if (!grad) return null
    return Adresa.findOne({
      where: {
        broj: address.broj,
        napomenaDostavljacu: address.napomenaDostavljacu,
        ulica: address.ulica,
        grad,
      },
    })
  }

  public static async CreateAdresaFromAddressInformation(
    address: AddressInformation,
  ): Promise<Adresa> {
    let grad = await Grad.GetExistingGradFromAddressInformation(address)
    if (!grad) {
      grad = Grad.GradFromAddressInformation(address)
      await grad.save()
    }
    const adresa = new Adresa()
    adresa.broj = address.broj
    adresa.napomenaDostavljacu = address.napomenaDostavljacu
    adresa.ulica = address.ulica
    adresa.grad = grad
    return adresa.save()
  }
}
