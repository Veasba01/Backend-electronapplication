import { Controller, Get, Post, Delete, Param, Body, Query } from '@nestjs/common';
import { AguinaldoService } from './aguinaldo.service';
import { Aguinaldo } from './aguinaldo.entity';

@Controller('aguinaldo')
export class AguinaldoController {
  constructor(private readonly aguinaldoService: AguinaldoService) {}

  @Get()
  async findAll(): Promise<Aguinaldo[]> {
    return this.aguinaldoService.findAll();
  }

  @Get('empleado/:cedula')
  async findByEmpleado(
    @Param('cedula') cedula: string,
    @Query('anio') anio?: number,
  ): Promise<Aguinaldo> {
    return this.aguinaldoService.findByEmpleado(cedula, anio);
  }

  @Get('panaderia/:nombre')
  async findByPanaderia(
    @Param('nombre') nombre: string,
    @Query('anio') anio?: number,
  ): Promise<Aguinaldo[]> {
    return this.aguinaldoService.findByPanaderia(nombre, anio);
  }

  @Get('anio/:anio')
  async findByAnio(@Param('anio') anio: number): Promise<Aguinaldo[]> {
    return this.aguinaldoService.findByAnio(anio);
  }

  @Get('total/panaderia/:nombre')
  async getTotalAguinaldosByPanaderia(
    @Param('nombre') nombre: string,
    @Query('anio') anio?: number,
  ): Promise<{ total: number; empleados: number }> {
    return this.aguinaldoService.getTotalAguinaldosByPanaderia(nombre, anio);
  }

  @Post('registrar-salario')
  async registrarSalarioBruto(
    @Body() datos: {
      nombreCompleto: string;
      cedulaEmpleado: string;
      razonSocial: string;
      panaderia: string;
      salarioTotalBruto: number;
      anio?: number;
    },
  ): Promise<Aguinaldo> {
    return this.aguinaldoService.registrarSalarioBruto(datos);
  }

  @Post('recalcular')
  async recalcularAguinaldos(@Query('anio') anio?: number): Promise<Aguinaldo[]> {
    return this.aguinaldoService.recalcularAguinaldos(anio);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<{ message: string }> {
    await this.aguinaldoService.delete(id);
    return { message: 'Registro de aguinaldo eliminado exitosamente' };
  }

  @Delete('reset/:anio')
  async resetAguinaldos(@Param('anio') anio: number): Promise<{ message: string }> {
    await this.aguinaldoService.resetAguinaldos(anio);
    return { message: `Todos los registros de aguinaldo del año ${anio} han sido eliminados` };
  }
}
