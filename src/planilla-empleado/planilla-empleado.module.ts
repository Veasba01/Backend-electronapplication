import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanillaEmpleadoController } from './planilla-empleado.controller';
import { PlanillaEmpleadoService } from './planilla-empleado.service';
import { PlanillaEmpleado } from './planilla-empleado.entity';
import { AguinaldoModule } from '../aguinaldo/aguinaldo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlanillaEmpleado]),
    AguinaldoModule,
  ],
  controllers: [PlanillaEmpleadoController],
  providers: [PlanillaEmpleadoService],
  exports: [PlanillaEmpleadoService],
})
export class PlanillaEmpleadoModule {}
