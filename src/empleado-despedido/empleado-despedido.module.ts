import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empleado } from '../empleado/empleado.entity';
import { EmpleadoDespedido } from './empleado-despedido.entity';
import { EmpleadoDespedidoService } from './empleado-despedido.service';
import { EmpleadoDespedidoController } from './empleado-despedido.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Empleado, EmpleadoDespedido])],
  controllers: [EmpleadoDespedidoController],
  providers: [EmpleadoDespedidoService],
})
export class EmpleadoDespedidoModule {}
