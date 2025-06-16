import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('aguinaldo')
export class Aguinaldo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombreCompleto: string;

  @Column()
  cedulaEmpleado: string;

  @Column()
  razonSocial: string;

  @Column()
  panaderia: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  acumuladoSalariosBrutos: number;
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  aguinaldoCalculado: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fechaCreacion: Date;
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fechaActualizacion: Date;

  @Column({ type: 'integer' })
  anio: number;
}
