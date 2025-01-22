import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Panaderia } from '../panaderia/panaderia.entity';
import { PlanillaQuincenal } from '../planilla-quincenal/planilla-quincenal.entity';

@Entity('razon_social') // Especifica el nombre correcto de la tabla
export class RazonSocial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @OneToMany(() => Panaderia, (panaderia) => panaderia.razonSocial)
  panaderias: Panaderia[];

  @OneToMany(() => PlanillaQuincenal, (planilla) => planilla.razonSocial)
  planillas: PlanillaQuincenal[];
}
