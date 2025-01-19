import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanillaQuincenal } from './planilla-quincenal.entity';
import { PlanillaEmpleado } from '../planilla-empleado/planilla-empleado.entity';
import { RazonSocial } from '../razon-social/razon-social.entity';
import { PlanillaQuincenalService } from './planilla-quincenal.service';
import { PlanillaQuincenalController } from './planilla-quincenal.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PlanillaQuincenal, PlanillaEmpleado, RazonSocial])],
  controllers: [PlanillaQuincenalController],
  providers: [PlanillaQuincenalService],
})
export class PlanillaQuincenalModule {}
