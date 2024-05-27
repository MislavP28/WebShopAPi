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
import Proizvod from './Proizvod'

@Index('Slika_pkey', ['slikaId'], { unique: true })
@Entity('Slika', { schema: 'public' })
export default class Slika extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'slika_id' })
  slikaId!: number

  @Column('character varying', { name: 'link', nullable: true, length: 1024 })
  link!: string | null

  @Column('character varying', { name: 'opis', nullable: true, length: 512 })
  opis!: string | null

  @Column('character varying', { name: 'naziv', nullable: true, length: 255 })
  naziv!: string | null

  @Column('boolean', {
    name: 'is_thumbnail',
    nullable: true,
    default: () => 'false',
  })
  isThumbnail!: boolean | null

  @ManyToOne(() => Proizvod, (proizvod: Proizvod) => proizvod.slikas)
  @JoinColumn([{ name: 'proizvod_id', referencedColumnName: 'proizvodId' }])
  proizvod!: Proizvod

  @Column({ type: 'integer', name: 'proizvod_id' })
  proizvodId!: number
}
