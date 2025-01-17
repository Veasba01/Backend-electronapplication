import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RazonSocialModule } from './razon-social/razon-social.module';
import { PanaderiaModule } from './panaderia/panaderia.module';
import { PuestoModule } from './puesto/puesto.module';
import { HorasTrabajadasModule } from './horas-trabajadas/horas-trabajadas.module';
import { EmpleadoModule } from './empleado/empleado.module';

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
    HorasTrabajadasModule,
    EmpleadoModule,
  ],
})
export class AppModule {}
