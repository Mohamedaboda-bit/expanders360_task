import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Service } from './service.entity';
import { Match } from './match.entity';
import { Country } from './country.entity';

export enum VendorSLAStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired'
}

@Entity('vendors')
export class Vendor {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0.00 })
  rating: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  response_sla_hours: number;

  @Column({
    type: 'enum',
    enum: VendorSLAStatus,
    default: VendorSLAStatus.ACTIVE
  })
  sla_status: VendorSLAStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToMany(() => Service, service => service.vendors)
  @JoinTable({
    name: 'vendor_services',
    joinColumn: { name: 'vendor_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'service_id', referencedColumnName: 'id' }
  })
  services: Service[];

  @ManyToMany(() => Country, country => country.vendors)
  @JoinTable({
    name: 'vendor_countries',
    joinColumn: { name: 'vendor_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'country_code', referencedColumnName: 'country_code' }
  })
  countries: Country[];

  @OneToMany(() => Match, match => match.vendor)
  matches: Match[];
}
