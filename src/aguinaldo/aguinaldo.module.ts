import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AguinaldoController } from './aguinaldo.controller';
import { AguinaldoService } from './aguinaldo.service';
import { Aguinaldo } from './aguinaldo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Aguinaldo])],
  controllers: [AguinaldoController],
  providers: [AguinaldoService],
  exports: [AguinaldoService],
})
export class AguinaldoModule {}
