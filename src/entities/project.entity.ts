import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Client } from './client.entity';
import { Service } from './service.entity';
import { Match } from './match.entity';
import { Country } from './country.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true })
  client_id: number;

  @Column({ type: 'char', length: 2 })
  country_code: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  budget: number;

  @Column({ type: 'enum', enum: ['active', 'paused', 'completed', 'cancelled'], default: 'active' })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Client, client => client.projects)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ManyToOne(() => Country, country => country.projects)
  @JoinColumn({ name: 'country_code', referencedColumnName: 'country_code' })
  country: Country;

  @ManyToMany(() => Service, service => service.projects)
  @JoinTable({
    name: 'project_services',
    joinColumn: { name: 'project_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'service_id', referencedColumnName: 'id' }
  })
  services: Service[];

  @OneToMany(() => Match, match => match.project)
  matches: Match[];
}
