import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Panaderia } from '../panaderia/panaderia.entity';
import { Puesto } from '../puesto/puesto.entity';

@Entity()
export class Empleado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @ManyToOne(() => Panaderia, (panaderia) => panaderia.empleados, {
    onDelete: 'CASCADE',
  })
  panaderia: Panaderia;

  @ManyToOne(() => Puesto, (puesto) => puesto.empleados, {
    onDelete: 'SET NULL',
  })
  puesto: Puesto;

}
