import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Puesto } from './puesto.entity';
import { PuestoService } from './puesto.service';
import { PuestoController } from './puesto.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Puesto])],
  controllers: [PuestoController],
  providers: [PuestoService],
})
export class PuestoModule {}
