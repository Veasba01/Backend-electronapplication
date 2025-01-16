import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Panaderia } from './panaderia.entity';

@Entity()
export class Empleado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  puesto: string;

  @ManyToOne(() => Panaderia, (panaderia) => panaderia.empleados)
  panaderia: Panaderia;
}
