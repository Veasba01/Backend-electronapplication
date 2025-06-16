import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanillaQuincenal } from './planilla-quincenal.entity';
import { PlanillaEmpleado } from '../planilla-empleado/planilla-empleado.entity';
import { RazonSocial } from '../razon-social/razon-social.entity';
import { PlanillaQuincenalService } from './planilla-quincenal.service';
import { PlanillaQuincenalController } from './planilla-quincenal.controller';
import { AguinaldoModule } from '../aguinaldo/aguinaldo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlanillaQuincenal, PlanillaEmpleado, RazonSocial]),
    AguinaldoModule,
  ],
  controllers: [PlanillaQuincenalController],
  providers: [PlanillaQuincenalService],
  exports: [PlanillaQuincenalService],
})
export class PlanillaQuincenalModule {}
