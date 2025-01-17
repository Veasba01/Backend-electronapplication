import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HorasTrabajadas } from './horas-trabajadas.entity';
import { HorasTrabajadasService } from './horas-trabajadas.service';
import { HorasTrabajadasController } from './horas-trabajadas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HorasTrabajadas])],
  controllers: [HorasTrabajadasController],
  providers: [HorasTrabajadasService],
})
export class HorasTrabajadasModule {}
