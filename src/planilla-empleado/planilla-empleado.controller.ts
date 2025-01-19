import { Controller, Post, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { PlanillaEmpleadoService } from './planilla-empleado.service';
import { PlanillaEmpleado } from './planilla-empleado.entity';

@Controller('planilla-empleados')
export class PlanillaEmpleadoController {
  constructor(private readonly planillaEmpleadoService: PlanillaEmpleadoService) {}

  @Post()
  async crear(@Body() data: Partial<PlanillaEmpleado>): Promise<PlanillaEmpleado> {
    return this.planillaEmpleadoService.crear(data);
  }

  @Get()
  async obtenerTodos(): Promise<PlanillaEmpleado[]> {
    return this.planillaEmpleadoService.obtenerTodos();
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: number): Promise<PlanillaEmpleado> {
    return this.planillaEmpleadoService.obtenerPorId(id);
  }

  @Patch(':id')
  async actualizar(
    @Param('id') id: number,
    @Body() data: Partial<PlanillaEmpleado>,
  ): Promise<PlanillaEmpleado> {
    return this.planillaEmpleadoService.actualizar(id, data);
  }

  @Delete(':id')
  async eliminar(@Param('id') id: number): Promise<void> {
    return this.planillaEmpleadoService.eliminar(id);
  }
}
