import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { RazonSocial } from '../razon-social/razon-social.entity';
import { PlanillaEmpleado } from '../planilla-empleado/planilla-empleado.entity';

@Entity('planillas_quincenales')
export class PlanillaQuincenal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  fechaInicio: Date;

  @Column({ type: 'date' })
  fechaFinal: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalesSalarioNormal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalesSalarioExtras: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalesSalarioBruto: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalesCCSS: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalesBPDC: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalesEmbargos: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalesAdelantos: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalesSalarioNeto: number;

  @ManyToOne(() => RazonSocial, (razonSocial) => razonSocial.planillas, {
    onDelete: 'CASCADE',
  })
  razonSocial: RazonSocial;

  @OneToMany(() => PlanillaEmpleado, (detalle) => detalle.planilla, {
    cascade: true,
  })
  detalles: PlanillaEmpleado[];
}
