import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { RazonSocial } from './razon-social.entity';
import { Empleado } from './empleado.entity';

@Entity()
export class Panaderia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @ManyToOne(() => RazonSocial, (razonSocial) => razonSocial.panaderias)
  razonSocial: RazonSocial;

  @OneToMany(() => Empleado, (empleado) => empleado.panaderia)
  empleados: Empleado[];
}
