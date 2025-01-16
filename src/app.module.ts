import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RazonSocial } from './entities/razon-social.entity';
import { Panaderia } from './entities/panaderia.entity';
import { Empleado } from './entities/empleado.entity';
import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [RazonSocial, Panaderia, Empleado],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([RazonSocial, Panaderia, Empleado]),
  ],
})
export class AppModule {}
