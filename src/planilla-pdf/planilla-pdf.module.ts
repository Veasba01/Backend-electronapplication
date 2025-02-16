import { Module } from '@nestjs/common';
import { PlanillaPdfService } from './planilla-pdf.service';
import { PlanillaPdfController } from './planilla-pdf.controller';
import { PlanillaQuincenalModule } from '../planilla-quincenal/planilla-quincenal.module';

@Module({
  imports: [PlanillaQuincenalModule], // Asegúrate de importar este módulo
  controllers: [PlanillaPdfController],
  providers: [PlanillaPdfService],
})
export class PlanillaPdfModule {}
