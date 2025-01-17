import { Controller, Post, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { PanaderiaService } from './panaderia.service';
import { Panaderia } from './panaderia.entity';

@Controller('panaderias')
export class PanaderiaController {
  constructor(private readonly panaderiaService: PanaderiaService) {}

  @Post()
  async crear(@Body() data: Partial<Panaderia>): Promise<Panaderia> {
    return this.panaderiaService.crear(data);
  }

  @Get()
  async obtenerTodas(): Promise<Panaderia[]> {
    return this.panaderiaService.obtenerTodas();
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: number): Promise<Panaderia> {
    return this.panaderiaService.obtenerPorId(id);
  }

  @Patch(':id')
  async actualizar(
    @Param('id') id: number,
    @Body() data: Partial<Panaderia>,
  ): Promise<Panaderia> {
    return this.panaderiaService.actualizar(id, data);
  }

  @Delete(':id')
  async eliminar(@Param('id') id: number): Promise<void> {
    return this.panaderiaService.eliminar(id);
  }
}
