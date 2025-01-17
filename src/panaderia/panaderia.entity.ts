import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { RazonSocial } from '../razon-social/razon-social.entity';
import { Empleado } from '../empleado/empleado.entity';

@Entity()
export class Panaderia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @ManyToOne(() => RazonSocial, (razonSocial) => razonSocial.panaderias, {
    onDelete: 'CASCADE',
  })
  razonSocial: RazonSocial;

  @OneToMany(() => Empleado, (empleado) => empleado.panaderia)
  empleados: Empleado[];
}
