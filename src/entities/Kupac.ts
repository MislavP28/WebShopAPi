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
import Kosarica from './Kosarica'
import Adresa from './Adresa'
import ProizvodKupac from './ProizvodKupac'
import BuyerInformation from '../models/buyerInformation'
import UserResponse from '../models/response/UserResponse'
import IntegerToRoleTransformer from '../utils/integerToRoleTransformer'
import Role from '../models/enums/Role'

@Index('Kupac_pkey', ['kupacId'], { unique: true })
@Entity('Kupac', { schema: 'public' })
export default class Kupac extends BaseEntity implements Express.User {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'kupac_id' })
  kupacId!: number

  @Column('character varying', { name: 'email', nullable: true, length: 255 })
  email!: string | null

  @Column('character varying', { name: 'ime', nullable: true, length: 255 })
  ime!: string | null

  @Column('character varying', { name: 'prezime', nullable: true, length: 255 })
  prezime!: string | null

  @Column('character varying', {
    name: 'broj_telefona',
    nullable: true,
    length: 32,
  })
  brojTelefona!: string | null

  @Column('integer', {
    name: 'role',
    nullable: true,
    transformer: new IntegerToRoleTransformer(),
  })
  role!: Role

  @OneToMany(() => Kosarica, (kosarica: Kosarica) => kosarica.kupac)
  kosaricas!: Kosarica[]

  @ManyToOne(() => Adresa, (adresa: Adresa) => adresa.kupacs)
  @JoinColumn([{ name: 'adresa_id', referencedColumnName: 'adresaId' }])
  adresa!: Adresa

  @ManyToOne(() => Kupac, (kupac) => kupac.kupacs)
  @JoinColumn([{ name: 'kupac_dostava_id', referencedColumnName: 'kupacId' }])
  kupacDostava!: Kupac

  @OneToMany(() => Kupac, (kupac) => kupac.kupacDostava)
  kupacs!: Kupac[]

  @OneToMany(
    () => ProizvodKupac,
    (proizvodKupac: ProizvodKupac) => proizvodKupac.kupac,
  )
  proizvodKupacs!: ProizvodKupac[]

  public static async GetExistingKupacFromBuyerInformation(
    buyer: BuyerInformation,
  ): Promise<Kupac | null> {
    return Kupac.findOne({
      where: {
        email: buyer.email,
        ime: buyer.ime,
        prezime: buyer.prezime,
        brojTelefona: buyer.brojTelefona,
      },
    })
  }

  public static async CreateKupacFromBuyerInformation(
    buyer: BuyerInformation,
  ): Promise<Kupac> {
    let adresa = await Adresa.GetExistingAddressFromAddressInformation(
      buyer.adresa,
    )
    if (!adresa) {
      adresa = await Adresa.CreateAdresaFromAddressInformation(buyer.adresa)
      await adresa.save()
    }
    let kupac = await Kupac.GetExistingKupacFromBuyerInformation(buyer)
    if (!kupac) {
      kupac = new Kupac()
      kupac.email = buyer.email
      kupac.ime = buyer.ime
      kupac.prezime = buyer.prezime
      kupac.brojTelefona = buyer.brojTelefona
      kupac.adresa = adresa
      await kupac.save()
    }
    return kupac
  }

  toUserResponse() {
    const userResponse = new UserResponse()
    userResponse.userId = this.kupacId
    userResponse.firstName = this.ime
    userResponse.lastName = this.prezime
    userResponse.phoneNumber = this.brojTelefona
    userResponse.email = this.email
    if (this.adresa) {
      userResponse.deliveryNotice = this.adresa.napomenaDostavljacu
      userResponse.street = this.adresa.ulica
      userResponse.streetNumber = this.adresa.broj
      if (this.adresa.grad) {
        userResponse.city = this.adresa.grad.grad
        userResponse.postalNumber = this.adresa.grad.postanskiBroj
        userResponse.country = this.adresa.grad.drzava
      }
    }

    return userResponse
  }
}
