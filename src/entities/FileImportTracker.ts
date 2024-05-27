import {
  BaseEntity,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Index('FileImportTracker_pkey', ['id'], { unique: true })
@Entity('FileImportTracker', { schema: 'public' })
export default class FileImportTracker extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id!: number

  @Column('character varying', { name: 'name', length: 255 })
  name!: string

  @Column('timestamp with time zone', {
    name: 'date',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  date!: Date | null
}
