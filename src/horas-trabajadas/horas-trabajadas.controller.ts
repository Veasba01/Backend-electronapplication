import { Controller, Post, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { HorasTrabajadasService } from './horas-trabajadas.service';
import { HorasTrabajadas } from './horas-trabajadas.entity';

@Controller('horas-trabajadas')
export class HorasTrabajadasController {
  constructor(private readonly horasTrabajadasService: HorasTrabajadasService) {}

  @Post()
  async crear(@Body() data: Partial<HorasTrabajadas>): Promise<HorasTrabajadas> {
    return this.horasTrabajadasService.crear(data);
  }

  @Get()
  async obtenerTodas(): Promise<HorasTrabajadas[]> {
    return this.horasTrabajadasService.obtenerTodas();
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: number): Promise<HorasTrabajadas> {
    return this.horasTrabajadasService.obtenerPorId(id);
  }

  @Patch(':id')
  async actualizar(
    @Param('id') id: number,
    @Body() data: Partial<HorasTrabajadas>,
  ): Promise<HorasTrabajadas> {
    return this.horasTrabajadasService.actualizar(id, data);
  }

  @Delete(':id')
  async eliminar(@Param('id') id: number): Promise<void> {
    return this.horasTrabajadasService.eliminar(id);
  }
}
