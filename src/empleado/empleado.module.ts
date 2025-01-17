import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empleado } from './empleado.entity';
import { EmpleadoService } from './empleado.service';
import { EmpleadoController } from './empleado.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Empleado])],
  controllers: [EmpleadoController],
  providers: [EmpleadoService],
})
export class EmpleadoModule {}
