import { Controller, Get, Param, Res } from '@nestjs/common';
import { PlanillaPdfService } from './planilla-pdf.service';
import { Response } from 'express';

@Controller('planilla-pdf')
export class PlanillaPdfController {
  constructor(private readonly planillaPdfService: PlanillaPdfService) {}

  @Get(':planillaId')
  async generatePlanilla(@Param('planillaId') planillaId: string, @Res() res: Response) {
    await this.planillaPdfService.generatePlanillaPDF(parseInt(planillaId, 10), res);
  }

  @Get('comprobantes/:planillaId')
  async generateComprobantes(@Param('planillaId') planillaId: number, @Res() res: Response) {
    return this.planillaPdfService.generateComprobantesPDF(planillaId, res);
  }

  @Get('bancos/:planillaId')
  async generateResumenPDF(@Param('planillaId') planillaId: number, @Res() res: Response) {
    return this.planillaPdfService.generateResumenPDF(planillaId, res);
  }
}
