import { Controller, Post, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { PuestoService } from './puesto.service';
import { Puesto } from './puesto.entity';

@Controller('puestos')
export class PuestoController {
  constructor(private readonly puestoService: PuestoService) {}

  @Post()
  async crear(@Body() data: Partial<Puesto>): Promise<Puesto> {
    return this.puestoService.crear(data);
  }

  @Get()
  async obtenerTodos(): Promise<Puesto[]> {
    return this.puestoService.obtenerTodos();
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: number): Promise<Puesto> {
    return this.puestoService.obtenerPorId(id);
  }

  @Patch(':id')
  async actualizar(
    @Param('id') id: number,
    @Body() data: Partial<Puesto>,
  ): Promise<Puesto> {
    return this.puestoService.actualizar(id, data);
  }

  @Delete(':id')
  async eliminar(@Param('id') id: number): Promise<void> {
    return this.puestoService.eliminar(id);
  }
}
