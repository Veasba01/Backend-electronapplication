import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { PlanillaQuincenal } from '../planilla-quincenal/planilla-quincenal.entity';
import { Panaderia } from '../panaderia/panaderia.entity';

@Entity('planilla_empleado')
export class PlanillaEmpleado {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PlanillaQuincenal, (planilla) => planilla.detalles, {
    onDelete: 'CASCADE',
  })
  planilla: PlanillaQuincenal;

  @ManyToOne(() => Panaderia, { onDelete: 'SET NULL', nullable: true })
  panaderia: Panaderia;

  @Column()
  nombreEmpleado: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  salarioMes: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  salarioHora: number;

  @Column({ type: 'int' })
  horasSencillas: number;

  @Column({ type: 'int' })
  horasExtras: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  salarioNormal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  salarioExtras: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  otrosIngresos: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  salarioTotalBruto: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  ccss: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  bpdc: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  embargos: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  adelantos: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  salarioNeto: number;
}
