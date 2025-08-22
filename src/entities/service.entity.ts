import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';
import { Project } from './project.entity';
import { Vendor } from './vendor.entity';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToMany(() => Project, project => project.services)
  projects: Project[];

  @ManyToMany(() => Vendor, vendor => vendor.services)
  vendors: Vendor[];
}
