import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Empleado } from '../empleado/empleado.entity';

@Entity()
export class Puesto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column('decimal', { precision: 10, scale: 2 })
  salarioHora: number;

  @OneToMany(() => Empleado, (empleado) => empleado.puesto)
  empleados: Empleado[];
}
