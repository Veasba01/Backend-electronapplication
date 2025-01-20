import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('empleados_despedidos')
export class EmpleadoDespedido {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  primerApellido: string;

  @Column()
  segundoApellido: string;

  @Column()
  cedula: string;

  @Column()
  razonDespido: string;

  @Column()
  panaderia: string;

  @Column({ type: 'date' })
  fechaDespido: Date;
}
