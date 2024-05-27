/* eslint-disable import/no-cycle */
import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import Kosarica from './Kosarica'
import Kupac from './Kupac'
import Proizvod from './Proizvod'
import StringToFloatTransformer from '../utils/stringToFloatTransformer'
import ProductResponse from '../models/response/ProductResponse'

@Index('ProizvodKupac_pkey', ['proizvodkupacId'], { unique: true })
@Entity('ProizvodKupac', { schema: 'public' })
export default class ProizvodKupac extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'proizvodkupac_id' })
  proizvodkupacId!: number

  @Column('integer', { name: 'kolicina' })
  kolicina!: number

  @Column('numeric', {
    name: 'cijena',
    precision: 10,
    scale: 2,
    transformer: new StringToFloatTransformer(),
  })
  cijena!: number

  @ManyToOne(() => Kosarica, (kosarica: Kosarica) => kosarica.proizvodKupacs)
  @JoinColumn([{ name: 'kosarica_id', referencedColumnName: 'kosaricaId' }])
  kosarica!: Kosarica

  @ManyToOne(() => Kupac, (kupac: Kupac) => kupac.proizvodKupacs)
  @JoinColumn([{ name: 'kupac_id', referencedColumnName: 'kupacId' }])
  kupac!: Kupac

  @ManyToOne(() => Proizvod, (proizvod: Proizvod) => proizvod.proizvodKupacs)
  @JoinColumn([{ name: 'proizvod_id', referencedColumnName: 'proizvodId' }])
  proizvod!: Proizvod

  public static CreateCartProduct(
    cart: Kosarica,
    product: Proizvod,
    quantity: number,
  ) {
    const pk = new ProizvodKupac()
    pk.cijena = product.cijena
    pk.kolicina = quantity
    pk.kosarica = cart
    pk.proizvod = product
    if (cart.kupac) pk.kupac = cart.kupac
    return pk
  }

  toCartProductsResponse(): ProductResponse {
    const productResponse = this.proizvod.toProductResponse()
    productResponse.quantity = this.kolicina
    productResponse.price = this.cijena
    return productResponse
  }
}
