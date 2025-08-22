import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany } from 'typeorm';
import { Project } from './project.entity';
import { Vendor } from './vendor.entity';

@Entity('countries')
export class Country {
  @PrimaryColumn({ type: 'char', length: 2 })
  country_code: string;

  @Column({ type: 'varchar', length: 100 })
  country_name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Project, project => project.country)
  projects: Project[];

  @ManyToMany(() => Vendor, vendor => vendor.countries)
  vendors: Vendor[];
}
