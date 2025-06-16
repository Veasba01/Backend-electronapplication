import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RazonSocialModule } from './razon-social/razon-social.module';
import { PanaderiaModule } from './panaderia/panaderia.module';
import { PuestoModule } from './puesto/puesto.module';
import { EmpleadoModule } from './empleado/empleado.module';
import { PlanillaQuincenalModule } from './planilla-quincenal/planilla-quincenal.module';
import { PlanillaEmpleadoModule } from './planilla-empleado/planilla-empleado.module';
import { EmpleadoDespedidoModule } from './empleado-despedido/empleado-despedido.module';
import { PlanillaPdfModule } from './planilla-pdf/planilla-pdf.module';
import { AguinaldoModule } from './aguinaldo/aguinaldo.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Deshabilitar en producción
    }),
    RazonSocialModule,
    PanaderiaModule,
    PuestoModule,
    EmpleadoModule,
    PlanillaQuincenalModule,
    PlanillaEmpleadoModule,
    EmpleadoDespedidoModule,
    PlanillaPdfModule,
    AguinaldoModule,
  ],
})
export class AppModule {}
