import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Panaderia } from '../panaderia/panaderia.entity';

@Entity()
export class RazonSocial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @OneToMany(() => Panaderia, (panaderia) => panaderia.razonSocial)
  panaderias: Panaderia[];
}
