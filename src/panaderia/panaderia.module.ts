import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Panaderia } from './panaderia.entity';
import { PanaderiaService } from './panaderia.service';
import { PanaderiaController } from './panaderia.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Panaderia])],
  controllers: [PanaderiaController],
  providers: [PanaderiaService],
})
export class PanaderiaModule {}
