import { Controller, Post, Get, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { EmpleadoService } from './empleado.service';
import { Empleado } from './empleado.entity';

@Controller('empleados')
export class EmpleadoController {
  constructor(private readonly empleadoService: EmpleadoService) {}

  @Post()
  async crear(@Body() data: Partial<Empleado>): Promise<Empleado> {
    return this.empleadoService.crear(data);
  }

  @Get()
  async obtenerTodos(): Promise<Empleado[]> {
    return this.empleadoService.obtenerTodos();
  }

  @Get('por-razon-social')
  async obtenerPorRazonSocial(
    @Query('razonSocialId') razonSocialId: number,
  ): Promise<Empleado[]> {
    if (!razonSocialId) {
      throw new Error('El parámetro razonSocialId es obligatorio');
    }

    return this.empleadoService.obtenerPorRazonSocial(razonSocialId);
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: number): Promise<Empleado> {
    return this.empleadoService.obtenerPorId(id);
  }

  @Patch(':id')
  async actualizar(
    @Param('id') id: number,
    @Body() data: Partial<Empleado>,
  ): Promise<Empleado> {
    return this.empleadoService.actualizar(id, data);
  }

  @Delete(':id')
  async eliminar(@Param('id') id: number): Promise<void> {
    return this.empleadoService.eliminar(id);
  }
}
