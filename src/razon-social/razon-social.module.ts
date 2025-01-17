import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RazonSocial } from './razon-social.entity';
import { RazonSocialService } from './razon-social.service';
import { RazonSocialController } from './razon-social.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RazonSocial])],
  controllers: [RazonSocialController],
  providers: [RazonSocialService],
})
export class RazonSocialModule {}
