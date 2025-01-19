import { Controller, Post, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { PlanillaQuincenalService } from './planilla-quincenal.service';
import { PlanillaQuincenal } from './planilla-quincenal.entity';

@Controller('planillas-quincenales')
export class PlanillaQuincenalController {
  constructor(private readonly planillaQuincenalService: PlanillaQuincenalService) {}

  @Post()
  async crear(@Body() data: Partial<PlanillaQuincenal>): Promise<PlanillaQuincenal> {
    return this.planillaQuincenalService.crear(data);
  }

  @Get()
    async obtenerTodas(): Promise<PlanillaQuincenal[]> {
    return this.planillaQuincenalService.obtenerTodas();
    }


  @Get(':id')
  async obtenerPorId(@Param('id') id: number): Promise<PlanillaQuincenal> {
    return this.planillaQuincenalService.obtenerPorId(id);
  }

  @Patch(':id')
  async actualizar(
    @Param('id') id: number,
    @Body() data: Partial<PlanillaQuincenal>,
  ): Promise<PlanillaQuincenal> {
    return this.planillaQuincenalService.actualizar(id, data);
  }

  @Delete(':id')
  async eliminar(@Param('id') id: number): Promise<void> {
    return this.planillaQuincenalService.eliminar(id);
  }
}
