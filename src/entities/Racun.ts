/* eslint-disable import/no-cycle */
import {
  BaseEntity,
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import Kosarica from './Kosarica'
import StringToFloatTransformer from '../utils/stringToFloatTransformer'

@Index('Racun_pkey', ['racunId'], { unique: true })
@Entity('Racun', { schema: 'public' })
export default class Racun extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'racun_id' })
  racunId!: number

  @Column('numeric', {
    name: 'total',
    nullable: true,
    precision: 10,
    scale: 2,
    transformer: new StringToFloatTransformer(),
  })
  total!: number | null

  @Column('character varying', {
    name: 'nacin_placanja',
    nullable: true,
    length: 255,
  })
  nacinPlacanja!: string | null

  @Column('character varying', { name: 'jir', nullable: true, length: 1024 })
  jir!: string | null

  @Column('character varying', {
    name: 'id_uplate',
    nullable: true,
    length: 1024,
  })
  idUplate!: string | null

  @OneToMany(() => Kosarica, (kosarica: Kosarica) => kosarica.racun)
  kosaricas!: Kosarica[]
}
