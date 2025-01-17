import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Empleado } from '../empleado/empleado.entity';

@Entity()
export class HorasTrabajadas {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Empleado, (empleado) => empleado.horasTrabajadas, {
    onDelete: 'CASCADE',
  })
  empleado: Empleado;

  @Column({ type: 'date' })
  fechaInicio: Date;

  @Column({ type: 'date' })
  fechaFinal: Date;

  @Column('int')
  horasSencillas: number;

  @Column('int')
  horasExtras: number;
}
