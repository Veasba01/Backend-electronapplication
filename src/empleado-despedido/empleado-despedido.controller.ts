import { Controller, Post, Param, Body, Get } from '@nestjs/common';
import { EmpleadoDespedidoService } from './empleado-despedido.service';
import { EmpleadoDespedido } from './empleado-despedido.entity';

@Controller('empleados-despedidos')
export class EmpleadoDespedidoController {
  constructor(private readonly empleadoDespedidoService: EmpleadoDespedidoService) {}

  @Post(':id/despedir')
  async despedirEmpleado(
    @Param('id') id: number,
    @Body() body: { razonDespido: string; panaderia: string },
  ): Promise<void> {
    return this.empleadoDespedidoService.despedirEmpleado(id, body);
  }

  @Get()
  async obtenerTodos(): Promise<EmpleadoDespedido[]> {
    return this.empleadoDespedidoService.obtenerTodos();
  }
}
